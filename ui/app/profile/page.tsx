import { auth } from '@/auth';
import { fetchProfile } from '@/lib/data';
export default async function Page() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  const profile = await fetchProfile(session.user.auth);
  return (
    <>
      <div>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </>
  );
}
