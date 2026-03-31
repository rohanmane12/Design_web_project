import PortfolioEditor from '@/components/admin/PortfolioEditor';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PortfolioEditor mode="edit" portfolioId={id} />;
}
