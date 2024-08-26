export const ErrorToastDescription = ({ details }: { details?: any }) => {
  return details ? (
    <pre className="mt-2 w-[340px] overflow-auto rounded-md bg-slate-950 p-4">
      <code className="text-white">{JSON.stringify(details, null, 2)}</code>
    </pre>
  ) : null;
};
