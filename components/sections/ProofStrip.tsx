import { Container } from "@/components/ui/Container";

const proofPoints = [
  {
    value: "8+",
    label: "Years Experience",
    context: "Across Ayo’s career",
  },
  {
    value: "$5M+",
    label: "Sales Pipeline Contribution",
    context: "Verified WorkSpan contribution",
  },
  {
    value: "150%",
    label: "Webinar Programme Growth",
    context: "Verified at WorkSpan",
  },
  {
    value: "$2M+",
    label: "Advocacy Pipeline Opportunities",
    context: "Verified at WorkSpan",
  },
] as const;

export function ProofStrip() {
  return (
    <section id="proof" className="proof-strip" aria-labelledby="proof-title">
      <Container>
        <div className="proof-strip__heading">
          <p>Selected proof</p>
          <h2 id="proof-title">Verified career and WorkSpan contribution.</h2>
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
