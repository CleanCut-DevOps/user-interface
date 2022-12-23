import { Image } from '@mantine/core';

export function Propertylist() {
  return (
    <div style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }}>
      <Image
        radius="md"
        src="src\assets\images\hdb.jpeg"
        alt="Random unsplash image"
        caption="HDB $50 per room"
      />
      <Image
        radius="md"
        src="src\assets\images\condo.jpeg"
        alt="Random unsplash image"
        caption="Condo $75 per room"
      />
      <Image
        radius="md"
        src="src\assets\images\landed.jpg"
        alt="Random unsplash image"
        caption="Landed $100 per room"
      />
      <Image
        radius="md"
        src="src\assets\images\office.jpg"
        alt="Random unsplash image"
        caption="Office $150 per room"
      />
    </div>
  );
}