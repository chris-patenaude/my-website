import dynamic from "next/dynamic";
const Snake = dynamic(() => import("./Snake"), { ssr: false });
export default function SnakeView() {
    return (
        <main className={"flex flex-col grow"}>
            <Snake />
        </main>
    );
}
