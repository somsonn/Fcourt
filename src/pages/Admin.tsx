import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Scale, LogOut, Plus, Edit, Trash2, Mail, Check, X, 
  LayoutDashboard, FileText, Bell, Users, Search, 
  Inbox, Settings, Home, Menu
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"

interface NewsItem {
  id: string;
  title_en: string;
  title_am: string;
  content_en: string;
  content_am: string;
  is_published: boolean;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Admin = () => {
  return (
    <SidebarProvider>
      <AdminDashboard />
    </SidebarProvider>
  )
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  
  // Define activeTab state to control which content is shown
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'messages' | 'settings'>('dashboard');

  const [news, setNews] = useState<NewsItem[]>([]);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title_en: '', title_am: '', content_en: '', content_am: '', is_published: false });
  const { toggleSidebar } = useSidebar();

  // Settings State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  useEffect(() => {
    if (user?.email) setNewEmail(user.email);
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!newEmail && !newPassword) {
      toast.info("No changes to update");
      return;
    }
    
    setIsUpdatingSettings(true);
    try {
      const updates: { email?: string; password?: string } = {};
      
      // Handle Email Update
      if (newEmail && newEmail !== user?.email) {
        updates.email = newEmail;
      }
      
      // Handle Password Update
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsUpdatingSettings(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsUpdatingSettings(false);
          return;
        }
        updates.password = newPassword;
      }

      if (Object.keys(updates).length === 0) {
         toast.info("No changes to update");
         setIsUpdatingSettings(false);
         return;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      if (updates.email) toast.info("Check your new email for a confirmation link.");
      
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setIsUpdatingSettings(false);
    }
  };


  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchNews();
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchNews = async () => {
    const { data } = await supabase.from('news_announcements').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const handleSaveNews = async () => {
    if (editingId) {
      const { error } = await supabase.from('news_announcements').update({
        ...form,
        published_at: form.is_published ? new Date().toISOString() : null
      }).eq('id', editingId);
      if (error) toast.error('Failed to update');
      else toast.success('Updated successfully');
    } else {
      const { error } = await supabase.from('news_announcements').insert([{
        ...form,
        published_at: form.is_published ? new Date().toISOString() : null
      }]);
      if (error) {
        console.error('Insert Error:', error);
        toast.error(`Failed to create: ${error.message}`);
      } else {
        toast.success('Created successfully');
        setShowForm(false);
        setEditingId(null);
        setForm({ title_en: '', title_am: '', content_en: '', content_am: '', is_published: false });
        fetchNews();
      }
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('news_announcements').delete().eq('id', id);
    fetchNews();
  };

  const toggleRead = async (id: string, current: boolean) => {
    await supabase.from('contact_submissions').update({ is_read: !current }).eq('id', id);
    fetchMessages();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) return null;

  const unreadMessages = messages.filter(m => !m.is_read).length;
  const publishedNews = news.filter(n => n.is_published).length;

  return (
    <div className="min-h-screen flex w-full bg-gray-50/50">
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4">
           <div className="flex items-center gap-2 text-primary px-2">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">Court Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')}
                    tooltip="Dashboard"
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'news'} 
                    onClick={() => setActiveTab('news')}
                    tooltip="News"
                  >
                    <FileText />
                    <span>Announcements</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'messages'} 
                    onClick={() => setActiveTab('messages')}
                    tooltip="Messages"
                  >
                    <Inbox />
                    <span>Messages</span>
                    {unreadMessages > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs px-1.5 min-w-[1.25rem] h-5">
                        {unreadMessages}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'settings'} 
                    onClick={() => setActiveTab('settings')}
                    tooltip="Settings"
                  >
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-3 px-2 py-2">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                A
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user?.email?.split('@')[0]}</span>
                <span className="text-xs text-muted-foreground truncate">Admin</span>
              </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-2">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header / Top Bar */}
        <header className="bg-white border-b h-14 flex items-center px-4 sticky top-0 z-10 lg:hidden">
          <SidebarTrigger />
          <div className="ml-4 font-semibold">Admin Panel</div>
        </header>

        {/* Main Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="container max-w-6xl py-8 px-4 md:px-8 space-y-8">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
                  </div>
                </div>

                {/* Dashboard Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{news.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {publishedNews} published
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Messages</CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{messages.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {unreadMessages} unread
                      </p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{unreadMessages}</div>
                      <p className="text-xs text-muted-foreground">
                        Tasks to review
                      </p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">System Status</CardTitle>
                      <Check className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Good</div>
                      <p className="text-xs text-muted-foreground">
                        All systems operational
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Recent Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {news.slice(0, 5).map((item) => (
                           <div key={item.id} className="flex items-center">
                              <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.title_en}</p>
                                <p className="text-sm text-muted-foreground font-ethiopic line-clamp-1">{item.title_am}</p>
                              </div>
                              <div className="ml-auto font-medium text-xs text-muted-foreground">
                                {format(new Date(item.created_at), 'MMM d')}
                              </div>
                            </div>
                        ))}
                         {news.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No announcements yet.</p>}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest messages from visitors
                      </CardDescription>
                    </CardHeader>
                     <CardContent>
                      <div className="space-y-4">
                        {messages.slice(0, 5).map((msg) => (
                           <div key={msg.id} className="flex items-start gap-3">
                              <span className={`flex h-2 w-2 translate-y-1.5 rounded-full ${!msg.is_read ? 'bg-primary' : 'bg-muted'}`} />
                              <div className="space-y-1 overflow-hidden">
                                <p className="text-sm font-medium leading-none truncate">{msg.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                              </div>
                            </div>
                        ))}
                         {messages.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No messages yet.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
                    <p className="text-muted-foreground">Manage court news and public announcements.</p>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> New Post
                  </Button>
                </div>

                {showForm && (
                   <Card className="border-primary/20 shadow-lg">
                    <CardHeader>
                      <CardTitle>{editingId ? 'Edit Announcement' : 'Create New Announcement'}</CardTitle>
                      <CardDescription>Fill in the details in both languages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">English Title</label>
                          <Input placeholder="Title" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amharic Title</label>
                          <Input placeholder="ርዕስ" value={form.title_am} onChange={(e) => setForm({ ...form, title_am: e.target.value })} className="font-ethiopic" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                          <label className="text-sm font-medium">English Content</label>
                          <Textarea placeholder="Content..." value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} rows={5} />
                        </div>
                         <div className="space-y-2">
                          <label className="text-sm font-medium">Amharic Content</label>
                           <Textarea placeholder="ይዘት..." value={form.content_am} onChange={(e) => setForm({ ...form, content_am: e.target.value })} rows={5} className="font-ethiopic" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg w-fit">
                        <input 
                          type="checkbox" 
                          id="publish"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={form.is_published} 
                          onChange={(e) => setForm({ ...form, is_published: e.target.checked })} 
                        />
                        <label htmlFor="publish" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          Publish Immediately
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-muted/20">
                      <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
                      <Button onClick={handleSaveNews}>{editingId ? 'Update Post' : 'Create Post'}</Button>
                    </CardFooter>
                  </Card>
                )}

                <div className="grid gap-4">
                  {news.map((item) => (
                    <Card key={item.id} className="group hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={item.is_published ? "default" : "secondary"} className={item.is_published ? "bg-green-600 hover:bg-green-700" : ""}>
                                {item.is_published ? 'Published' : 'Draft'}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                 <LayoutDashboard className="h-3 w-3" />
                                 {format(new Date(item.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg">{item.title_en}</h3>
                             <h4 className="text-md text-muted-foreground font-ethiopic">{item.title_am}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2">{item.content_en}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="outline" onClick={() => { setForm(item); setEditingId(item.id); setShowForm(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDeleteNews(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {news.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-white border border-dashed rounded-lg">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No announcements yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
                    <p className="text-muted-foreground">Inquiries from the contact form.</p>
                  </div>
                </div>

                <Card>
                   <div className="divide-y max-h-[600px] overflow-auto">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-6 transition-colors hover:bg-muted/30 ${!msg.is_read ? 'bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!msg.is_read && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
                              <span className="font-medium">{msg.name}</span>
                              <span className="text-muted-foreground text-sm">• {msg.email}</span>
                              <span className="text-xs text-muted-foreground ml-auto md:ml-2">
                                 {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="font-medium text-foreground">{msg.subject}</p>
                            <p className="text-sm text-muted-foreground">{msg.message}</p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title={msg.is_read ? "Mark as unread" : "Mark as read"}
                            onClick={() => toggleRead(msg.id, msg.is_read)}
                            className={msg.is_read ? "text-muted-foreground" : "text-primary"}
                          >
                            {msg.is_read ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                     {messages.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No messages received yet.</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
             {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                  <p className="text-muted-foreground">Manage account and system settings.</p>
                </div>
                 <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                       <Label htmlFor="email">Email Address</Label>
                       <Input 
                        id="email" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        placeholder="Enter new email"
                       />
                       <p className="text-xs text-muted-foreground">Changing email will require confirmation.</p>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Change Password</h3>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button onClick={handleUpdateProfile} disabled={isUpdatingSettings}>
                       {isUpdatingSettings ? 'Updating...' : 'Save Changes'}
                     </Button>
                  </CardFooter>
                 </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Admin;
