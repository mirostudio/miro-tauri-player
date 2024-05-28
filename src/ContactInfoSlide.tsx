import CenteredCard from "./widgets/CenteredCard";
import SvgLogo from "./widgets/SvgLogo";

function ContactInfoSlide () : JSX.Element {
  return (
    <CenteredCard>
      <div className="text-2xl font-bold">
        Ad here:
      </div>
      <SvgLogo fill="#448844" />
      <br/><br/>
      <div className="text-sm italic">
        Contact: 987-6543-2100
      </div>
    </CenteredCard>
    );
}

export default ContactInfoSlide;
