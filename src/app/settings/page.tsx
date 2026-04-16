import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-10 pb-16">
      <div>
        <h3 className="text-2xl font-medium tracking-tight">Profile</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your public profile and personal details.
        </p>
      </div>
      <Separator />
      
      <div className="space-y-10">
        {/* Avatar Section */}
        <section className="flex flex-col md:flex-row gap-8 md:items-center">
          <div className="space-y-1 md:w-1/3 shrink-0">
            <h4 className="text-sm font-medium leading-none">Avatar</h4>
            <p className="text-[13px] text-muted-foreground">
              This is your public avatar. Click to upload a new one.
            </p>
          </div>
          <div className="flex items-center gap-6 md:w-2/3">
            <Avatar className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity border bg-muted">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
              <AvatarFallback className="text-2xl font-medium">U</AvatarFallback>
            </Avatar>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-9">Upload new</Button>
              <Button variant="ghost" size="sm" className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Personal Information Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="space-y-1 md:w-1/3 shrink-0">
            <h4 className="text-sm font-medium leading-none">Personal Information</h4>
            <p className="text-[13px] text-muted-foreground">
              Update your basic personal details.
            </p>
          </div>
          <div className="space-y-6 md:w-2/3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First name</Label>
                <Input id="firstName" placeholder="Jane" defaultValue="Jane" className="max-w-xs" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last name</Label>
                <Input id="lastName" placeholder="Doe" defaultValue="Doe" className="max-w-xs" />
              </div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email address</Label>
              <Input id="email" type="email" placeholder="jane@example.com" defaultValue="jane@example.com" className="max-w-md" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Bio Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="space-y-1 md:w-1/3 shrink-0">
            <h4 className="text-sm font-medium leading-none">Bio</h4>
            <p className="text-[13px] text-muted-foreground">
              Write a short bio about yourself.
            </p>
          </div>
          <div className="space-y-4 md:w-2/3">
            <div className="space-y-2.5">
              <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biography</Label>
              <textarea 
                id="bio"
                className="flex min-h-[120px] w-full max-w-lg rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="I'm a software engineer..."
                defaultValue="Product Designer building the future of software."
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown to format your bio. Max 500 characters.
              </p>
            </div>
          </div>
        </section>

      </div>

      <div className="pt-6 flex justify-end gap-3">
        <Button variant="outline" className="h-9">Cancel</Button>
        <Button className="h-9">Save Changes</Button>
      </div>
    </div>
  );
}