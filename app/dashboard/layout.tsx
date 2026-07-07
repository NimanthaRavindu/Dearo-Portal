import { PrismaClient } from "@prisma/client";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/Sidebar";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
    searchParams,
}: {
    children: React.ReactNode;
    searchParams: Promise<any>;
}) {
    const resolvedParams = await searchParams;
    const nic = resolvedParams?.nic as string;
    const password = resolvedParams?.password as string;
    
    const branches = await prisma.branch.findMany();

    return (
        
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            
                <Sidebar branches={branches} nic={nic} password={password}/>

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-64 flex flex-col">
                    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
                        <Navbar />
                    </header>

                    <main className="p-6 lg:p-10 flex-1 bg-slate-50 dark:bg-slate-950">
                        {children}
                    </main>
                </div>
            </div>
        
    );
}