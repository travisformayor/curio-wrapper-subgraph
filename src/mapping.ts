import {
  TransferSingle as TransferSingleEvent,
  TransferBatch as TransferBatchEvent
} from "../generated/CurioERC1155Wrapper/CurioERC1155Wrapper"
// import { CurioCollector, CardBalance, SetBalance, } from "../generated/schema"

export function handleTransferSingle(event: TransferSingleEvent): void {

  const burnAddr:string = "0x0000000000000000000000000000000000000000";
  const contractAddr:string = "0x73DA73EF3a6982109c4d5BDb0dB9dd3E3783f313";

  // == Possible Event Transaction Types == //
  // Wrapping Event:  
  //   _operator = user && same as _to
  //   _from = 0x0 (burn) 
  //   _to = user
  // Unwrapping Event:
  //   _operator = user
  //   _from = Contract
  //   _to = 0x0 (burn)
  // Transfer Event:
  //   _operator = user && same as _from
  //   _from = user
  //   _to = a different user
  const eventOperator = event.params._operator.toHex(); // addr that executed transfer
  const eventFrom = event.params._from.toHex();
  const eventTo = event.params._to.toHex();
  const eventCard = event.params._id.toHex();
  const eventQuantity = event.params._value.toHex();

  if (eventOperator == eventTo && eventFrom == burnAddr ) {
    // Wrap Event
    // Check and update balance of eventTo
  } else if (eventFrom == contractAddr && eventTo == burnAddr) {
    // Unwrap Event
    // Check and update balance of eventOperator
  } else if (eventOperator == eventFrom) {
    // Normal Transfer Event
    // Check and update balance of eventFrom and eventTo
  }

  // let entity = new TransferSingle(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity._operator = event.params._operator
  // entity._from = event.params._from
  // entity._to = event.params._to
  // entity._id = event.params._id
  // entity._value = event.params._value
  // entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // let entity = new TransferBatch(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity._operator = event.params._operator
  // entity._from = event.params._from
  // entity._to = event.params._to
  // entity._ids = event.params._ids
  // entity._values = event.params._values
  // entity.save()
}
