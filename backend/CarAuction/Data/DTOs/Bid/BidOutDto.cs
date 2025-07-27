namespace CarAuction.Data.Dtos.Bid
{
	public class BidOutDto
	{
		public double BasePrice { get; set; }
		public double BasicBuyerFee { get; set; }
		public double SellerSpecialFee { get; set; }
		public double AssociationFee { get; set; }
		public double StorageFee { get; set; }
		public double TotalCost => BasePrice + BasicBuyerFee + SellerSpecialFee + AssociationFee + StorageFee;
  }
}
