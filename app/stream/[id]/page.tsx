import StreamDetailPage from '@/components/StreamDetailPage'

export default async function StreamDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <StreamDetailPage streamId={id} />
}

