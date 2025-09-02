"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from "@workspace/ui/components/button"
import { Bold, Italic, Link as LinkIcon, List, Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Editor({ value, onChange, placeholder = "Start writing..." }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    immediatelyRender: false,
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] w-full focus-visible:outline-none prose prose-sm dark:prose-invert max-w-none overflow-x-auto',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if(html !== value){
        onChange(html)
      }
    },
  })

  useEffect(() => {
    if(editor && value !== editor.getHTML()){
      editor.commands.setContent(value, false)
    }
  }, [editor, value])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !editor) return null

  return (
    <div className="w-full rounded-lg border bg-background">
      <div className="border-b bg-muted p-2 flex gap-2">
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted-foreground/20' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted-foreground/20' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={editor.isActive('link') ? 'bg-muted-foreground/20' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter image URL')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-3">
        <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none break-words" />
      </div>
    </div>
  )
}