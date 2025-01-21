import styles from "@/css/elements/Directory.module.css"
import { DirectoryItem } from '@/components/elements/DirectoryItem'
import { IconFolder, IconFolderOpen } from '@tabler/icons-react'
import { IDirectory } from '@/interfaces/Directory'
import { useState } from 'react'

interface Props {
  directory: IDirectory
}


export function Directory({ directory }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className={`${styles.directory} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.header} onClick={toggleExpand}>
        {isExpanded ? <IconFolderOpen size={20} /> : <IconFolder size={20} />}
        <h2 className={styles.title}>{directory.title}</h2>
      </div>
      <div className={`${styles.items} ${isExpanded ? styles.expanded : ''}`}>
        {directory.items.map((item, index) => (
          <DirectoryItem key={`${item.title}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}
