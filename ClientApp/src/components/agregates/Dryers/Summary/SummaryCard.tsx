
type Props = {
  title: string
  tags: string[]
}


export const SummaryCard: React.FC<Props> = ({
  title,
  tags,
}) => {

  return <div className="summary-card">
    <div className="summary-card-title">{title}</div>
    <div className="summary-card-content">
      {tags.map(t => <div id={t} className="summary-card-tag" key={t} title={t}></div>)}
    </div>
  </div>
}