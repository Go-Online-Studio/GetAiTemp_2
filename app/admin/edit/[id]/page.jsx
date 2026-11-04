import { notFound } from 'next/navigation';
import { getVideoById } from '@/lib/data-source';
import VideoForm from '@/components/VideoForm';

export default async function EditVideoPage({ params }) {
  const { id } = await params;

  const video = await getVideoById(id, true);

  if (!video) {
    notFound();
  }

  const serializedVideo = JSON.parse(JSON.stringify(video));

  return (
    <div style={{ background: '#E3F2F6', minHeight: '100vh', padding: '0 24px' }}>
      <VideoForm initialData={serializedVideo} isEdit={true} />
    </div>
  );
}
