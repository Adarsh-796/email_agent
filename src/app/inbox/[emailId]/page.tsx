export default async function EmailPage(props: PageProps<"/inbox/[emailId]">) {
  const { params } = props;
  const { emailId } = await params;
  return <div>{emailId}</div>;
}
