function Avatar({ user }) {
  return (
    <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      {user.avatar
        ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
        : <span className="text-sm text-indigo-500 font-medium">{user.pseudo?.[0]}</span>
      }
    </div>
  );
}

export default Avatar;