import styles from "@/css/elements/DirectorItem.module.css"
import { IconFolder, IconFolderOpen } from '@tabler/icons-react'
import { IItem, TYPE_CONTENT } from '@/interfaces/Directory'
import { useState } from 'react'


interface Props {
  item: IItem
}

export function DirectoryItem({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    if (item.type === TYPE_CONTENT.DIRECTORY) {
      setIsExpanded((prev) => !prev)
    }
  }

  if (item.type === TYPE_CONTENT.ANCHOR) {

    return (
      <div className={styles.item}>
        <a href={item.url} className={styles.anchor} target="_blank" rel="noopener noreferrer">
          <img src={item.image} alt={item.title} className={styles.image} />
          <span className={styles.title}>{item.title}</span>
        </a>
      </div>
    )
  }

  return (
    <div>
      <div
        className={`${styles.item} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpand}
      >
        {isExpanded ? <IconFolderOpen size={20} /> : <IconFolder size={20} />}
        <span className={styles.title}>{item.title}</span>
      </div>
      <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
        {item.items.map((subItem, index) => (
          <DirectoryItem key={`${subItem.title}-${index}`} item={subItem} />
        ))}
      </div>
    </div>
  )
}