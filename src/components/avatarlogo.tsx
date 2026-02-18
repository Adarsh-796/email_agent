import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AvatarLogo() {
  return (
    <Avatar>
      <AvatarImage src="https://lh3.googleusercontent.com/rd-ogw/AF2bZyiSykce9NNuzApQNFI17sco44S2qUlMgGRYU0esTwqLtUwLYI7hE4Re7IoztzxYtR-uft3CCaM7eiHoWR1Ne1cnMHJEaBBWzK5BlvqdpguWeeVrQXyU8Bh7GMJGfJLcHTqjDMkDM5LEaW9g6e96XaGax3XAw_jUXPpkoW3sPIbceY7IkqunSxQZNmFtJGF1vg_vjkZg=s32-c" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
