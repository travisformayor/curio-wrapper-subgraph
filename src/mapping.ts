import {
  OwnershipTransferred as OwnershipTransferredEvent,
  TransferSingle as TransferSingleEvent,
  TransferBatch as TransferBatchEvent,
  ApprovalForAll as ApprovalForAllEvent,
  URI as URIEvent
} from "../generated/CurioERC1155Wrapper/CurioERC1155Wrapper"
import {
  OwnershipTransferred,
  TransferSingle,
  TransferBatch,
  ApprovalForAll,
  URI
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._operator = event.params._operator
  entity._from = event.params._from
  entity._to = event.params._to
  entity._id = event.params._id
  entity._value = event.params._value
  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._operator = event.params._operator
  entity._from = event.params._from
  entity._to = event.params._to
  entity._ids = event.params._ids
  entity._values = event.params._values
  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._owner = event.params._owner
  entity._operator = event.params._operator
  entity._approved = event.params._approved
  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._value = event.params._value
  entity._id = event.params._id
  entity.save()
}
