import dynamic from "next/dynamic";
const Snake = dynamic(() => import("./Snake"), { ssr: false });
export default function SnakeView() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <Snake />
        </main>
    );
}
