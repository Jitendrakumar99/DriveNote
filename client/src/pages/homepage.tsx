import Hero from "../components/homepage/Hero";

export default function Homepage(){
    return(
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#7c3aed,#4f46e5)] opacity-10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(255,255,255,0))]"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Hero />
            </div>
        </main>
    )
}