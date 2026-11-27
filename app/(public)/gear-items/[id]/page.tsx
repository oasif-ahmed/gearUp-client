import { getGearItemById } from "@/services/gear-item.service";
import { 
  getReviewsForGear, 
  createReview, 
  updateReview, 
  deleteReview 
} from "@/services/review.service";
import GearDetailsClient from "./gearDetails+review";

export default async function GearItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch gear item details and reviews concurrently on the server
  const [gearResponse, reviews] = await Promise.all([
    getGearItemById(id),
    getReviewsForGear(id),
  ]);

  const gearItem = gearResponse?.gearItem || gearResponse;

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      <GearDetailsClient
        gearItem={gearItem}
        initialReviews={reviews}
        createReviewAction={createReview}
        updateReviewAction={updateReview}
        deleteReviewAction={deleteReview}
      />
    </main>
  );
}