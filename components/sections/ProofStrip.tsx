import { Container } from "@/components/ui/Container";

const proofPoints = [
  {
    value: "8+",
    label: "Years Experience",
    context: "Across my career",
  },
  {
    value: "$5M+",
    label: "Sales Pipeline Contribution",
    context: "At WorkSpan",
  },
  {
    value: "150%",
    label: "Webinar Programme Growth",
    context: "At WorkSpan",
  },
  {
    value: "$2M+",
    label: "Advocacy Pipeline Opportunities",
    context: "At WorkSpan",
  },
] as const;

export function ProofStrip() {
  return (
    <section id="proof" className="proof-strip" aria-labelledby="proof-title">
      <Container>
        <div className="proof-strip__heading">
          <p>Career highlights</p>
          <h2 id="proof-title">My work in numbers</h2>
        </div>

        <dl className="proof-strip__grid">
          {proofPoints.map((proofPoint) => (
            <div className="proof-strip__item" key={proofPoint.label}>
              <dt>
                <span className="proof-strip__value">{proofPoint.value}</span>
                <span className="proof-strip__label">{proofPoint.label}</span>
              </dt>
              <dd>{proofPoint.context}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
