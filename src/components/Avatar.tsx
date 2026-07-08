import React from "react";

type Props = {
  avatar?: string;
  username: string;
  className?: string;
};

const Avatar = ({
  avatar,
  username,
  className = "",
}: Props) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt="avatar"
        className={`w-9 h-9 object-cover border cursor-default ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-9 h-9 rounded-full bg-sky-500 text-white cursor-default flex items-center justify-center font-semibold ${className}`}
    >
      {username[0].toUpperCase()}
    </div>
  );
};

export default Avatar;