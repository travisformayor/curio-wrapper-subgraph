
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { CurioUser, CardBalance, SetBalance, } from "../generated/schema"
import {
  CurioERC1155Wrapper as WrapperContract,
  TransferSingle as TransferSingleEvent,
  TransferBatch as TransferBatchEvent
} from "../generated/CurioERC1155Wrapper/CurioERC1155Wrapper"

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

function updateUserCardBalance(
  eventUser: Address, 
  eventCardId: BigInt, 
  contractLookup: WrapperContract
) {
    // Load or Create user record
    let user:CurioUser = CurioUser.load(eventUser.toHex());
    if (!user) user = new CurioUser(eventUser.toHex());
    // to do: a .save()
    
    // Load or Create record of users balance for the card involved in the event
    const userCardId:string = `${eventUser.toHex()}-${eventCardId.toString()}`;
    let userCardBalance:CardBalance = CardBalance.load(userCardId);
    if (!userCardBalance) userCardBalance = new CardBalance(userCardId)

    // Update user balance for card involved in event
    userCardBalance.cardNumber = eventCardId;
    userCardBalance.balance = contractLookup.balanceOf(eventUser, eventCardId);
    userCardBalance.save();

    // Associate the userCardBalance with the users record
    // If it's already associated there is no need to update the data, 
    // (cont.) it is a reference to the CardBalance that was updated
    if (user.cards.indexOf(userCardBalance.id) == -1) {
      // -1 means this userCardBalance id has not been assoicated yet (first time)
      user.cards.push(userCardBalance.id);
    }

    // to do: function to add unique number and sets
    user.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {

  const burnAddr:string = "0x0000000000000000000000000000000000000000";
  const contractAddr:string = "0x73DA73EF3a6982109c4d5BDb0dB9dd3E3783f313";

  const eventOperator:Address = event.params._operator; // addr that executed transfer
  const eventFrom:Address = event.params._from;
  const eventTo:Address = event.params._to;
  const eventCard:BigInt = event.params._id;
  // const eventQuantity:BigInt = event.params._value;
  
  // Wrapper Contract object to access public state
  const contractLookup:WrapperContract = WrapperContract.bind(event.address);

  if (eventOperator.toHex() == eventTo.toHex() && eventFrom.toHex() == burnAddr ) {
    // Wrap Event
    // Check and update balance of eventTo
    updateUserCardBalance(eventTo, eventCard, contractLookup);
  } else if (eventFrom.toHex() == contractAddr && eventTo.toHex() == burnAddr) {
    // Unwrap Event
    // Check and update balance of eventOperator
    updateUserCardBalance(eventOperator, eventCard, contractLookup);
  } else if (eventOperator == eventFrom) {
    // Normal Transfer Event
    // Check and update balance of eventFrom and eventTo
    updateUserCardBalance(eventFrom, eventCard, contractLookup);
    updateUserCardBalance(eventTo, eventCard, contractLookup);
  }
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // to do
}
