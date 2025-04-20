const useProfileImage = (path: string | null) => {
  return path
    ? 'https://tugas2-fe.labse.id/assets/' + path
    : '/default-avatar.png';
};

export default useProfileImage;
