import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@abhitickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
