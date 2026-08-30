export default function AppLogo() {
    return (
        <div className="flex h-20 min-w-0 flex-1 items-center justify-center px-3 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:px-0">
            <img
                src="/logo.png"
                alt="The Sultan Umroh"
                className="h-18 w-auto max-w-full object-contain group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
            />
        </div>
    );
}
