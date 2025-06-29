import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});


it("Checking the version incremental", async()=>{

  const ticket = Ticket.build({
    title: "Show",
    price: 33,
    userId: "234433"
  })

  await ticket.save();
  expect(ticket.version).toEqual(0)

  await ticket.save();
  expect(ticket.version).toEqual(1)

  await ticket.save();
  expect(ticket.version).toEqual(2)


})