interface PaystackProps {
  key: string
  email: string
  amount: number
  currency: string
  ref: string
  onClose: () => void
  callback: (response: any) => void
}

interface PaystackPop {
  setup: (props: PaystackProps) => {
    openIframe: () => void
  }
}

declare const PaystackPop: PaystackPop