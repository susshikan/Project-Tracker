import FloatingNavbar from "./FloatingNavbar";
import Title from "./Title";

export default function Navbar(){
    return (
        <div className="flex items-center justify-between w-full px-6 py-4 ">
            {/* Title di pojok kiri */}
            <div className="text-xl font-semibold">
                {/* Ganti ini dengan komponen title kamu */}
                <Title />
            </div>

            {/* Floating navbar di pojok kanan */}
            <div>
                {/* Ganti ini dengan komponen navbar kamu */}
                <div className="text-white px-4 py-2 rounded-full shadow-lg">
                    <FloatingNavbar />
                </div>
            </div>
        </div>

    )
}