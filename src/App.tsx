export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind 테스트 성공! 🎉
      </h1>

      <button className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition">
        버튼 스타일 확인
      </button>

      <p className="text-lg text-gray-700">
        Tailwind가 제대로 적용되면 이 텍스트는 회색입니다.
      </p>

      <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-xl shadow-lg" />
    </div>
  );
}
