import { redirect } from "next/navigation";

// The admin home used to be a second, out-of-date copy of the applications page
// (it crashed after an AI review). Send admins to the real one.
export default function AdminHome() {
  redirect("/admin/applications");
}
