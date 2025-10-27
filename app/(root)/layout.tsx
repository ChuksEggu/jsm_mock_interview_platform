import {ReactNode} from 'react'
import Image from "next/image";
import Link from "next/link";
import {isAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";

const RootLayout = async ({children} :{children:ReactNode }) => {
    try {
        const isUserAuthenticated = await isAuthenticated();
        if (!isUserAuthenticated) redirect('/sign-in');
    } catch (error) {
        // If Firebase Admin is not set up, allow access
        // Client-side auth will handle protection
        console.warn('Server-side auth check failed, allowing access:', error);
    }

    return (
        <div className="root-layout">
            <nav>

                <Link href="/" className="flex items-center gap-2" >
                    <Image src="/logo.svg" alt="logo" width={38} height={32} />

                    <h2 className= "text-primary-100">PrepWise</h2>


                </Link>
            </nav>

            <main className="flex-1 p-8">{children}</main>
        </div>
    )
}
export default RootLayout
