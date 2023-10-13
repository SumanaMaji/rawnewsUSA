class Transaction {
  constructor(
    dision,
    divisionName,
    date,
    id,
    typeName,
    subTypeName,
    vechileNo,
    gateInOut,
    partyName,
    ERPRefNo,
    ERPRefDate,
    remark,
  ) {
    this.division = dision;
    this.divisionName = divisionName;
    this.date = date;
    this.id = id;
    this.typeName = typeName;
    this.subTypeName = subTypeName;
    this.vechileNo = vechileNo;
    this.gateInOut = gateInOut;
    this.partyName = partyName;
    this.ERPRefNo = ERPRefNo;
    this.ERPRefDate = ERPRefDate;
    this.remark = remark;
  }
}
export default Transaction;
