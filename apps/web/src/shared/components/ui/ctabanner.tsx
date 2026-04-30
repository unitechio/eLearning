import { Button } from "@/shared/components/ui/button";

export function CTABanner() {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex items-center justify-between mt-12 mx-4 md:mx-0">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900">Gia hạn miễn phí!</h3>
        <p className="text-gray-500 text-sm mt-1">
          Tài khoản của bạn đã hết hạn sử dụng. Hãy gia hạn ngay để tiếp tục việc học nhé!
        </p>
        <Button className="mt-3 bg-red-600 text-white hover:bg-red-700">Gia hạn miễn phí</Button>
      </div>
      <div className="text-6xl hidden md:block">📚</div>
    </div>
  );
}
