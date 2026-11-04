import VideoForm from '@/components/VideoForm';

export default function NewVideoPage() {
  return (
    <div style={{ background: '#E3F2F6', minHeight: '100vh', padding: '0 24px' }}>
      <VideoForm isEdit={false} />
    </div>
  );
}
