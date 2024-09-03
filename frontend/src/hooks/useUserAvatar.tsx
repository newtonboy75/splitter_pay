import genericIcon from "./../assets/avatar.webp";

const useUserAvatar = (split: { splitters: any[]; }) => {
  return (
    <div className="flex mr-2">
        {split.splitters.map((split: any) => {
          return (
            <img
              className="border-2 border-white rounded-full h-16 w-16 -mr-6"
              src={genericIcon}
              alt={split.status}
              title={split.status}
            />
          );
        })}
      </div>
  )
}

export default useUserAvatar