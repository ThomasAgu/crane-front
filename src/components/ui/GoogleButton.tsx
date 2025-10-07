import google from '../../public/google.svg';
import Image from "next/image";

type GoogleButtonProps = {
  text: string;
};

export default function GoogleButton({text}: GoogleButtonProps) {
    return (
        <button className="btn-google w-full max-w-sm">
          <span className="mr-2">
            <Image
                src={google}
                alt="Google"
                width={30}
                height={30}
            />
            </span> {text}
        </button>
    );
}