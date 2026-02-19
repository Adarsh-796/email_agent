import AvatarLogo from "./avatarlogo";
import Logo from "./logo";
import SearchForm from "./search-form";

export default function NavBar() {
  return (
    <div className="flex mt-4 mx-8 items-center gap-45 justify-between">
      <Logo />
      <div className="flex flex-1 justify-between items-center">
        <SearchForm />
        <AvatarLogo />
      </div>
    </div>
  );
}
