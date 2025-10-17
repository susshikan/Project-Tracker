import { AppearanceSettings } from "./AppearanceSettings";
import { ProfileSettings } from "./ProfileSettings";

export default function SettingsPage() {
    return (
        <main className="flex items-center justify-center min-h-screen ">
            <div className="container max-w-4xl py-8 px-4 md:px-8">
                <div className="space-y-8 ">
                    <ProfileSettings />
                    <AppearanceSettings />
                </div>
            </div>
      </main>
    )
}