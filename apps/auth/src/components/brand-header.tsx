import Image from 'next/image';
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

export function BrandHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 mb-8">
      <div className="relative w-12 h-12 mb-1">
        <Image 
          src="/zap-logo.png" 
          alt="ZAP" 
          fill 
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center space-y-1">
        <Heading level={1} className="text-on-surface">ZAP Vault</Heading>
        <Text size="body-small" className="text-on-surface-variant">Master Authentication Gateway</Text>
      </div>
    </div>
  );
}
