import StreamDetailPage from '@/components/StreamDetailPage'

export default function StreamDetail({ params }: { params: { id: string } }) {
  return <StreamDetailPage streamId={params.id} />
}

