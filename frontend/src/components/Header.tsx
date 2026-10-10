export default function Header() {
  return (
    <header className="bg-emerald-100 p-4 shadow-md h-16 flex items-center justify-center">
      <h1
        className="m-0 font-bold"
        style={{
          color: '#064e3b',
          fontSize: '28px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        会員管理システム
      </h1>
    </header>
  );
}