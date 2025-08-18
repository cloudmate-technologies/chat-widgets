import { For, onMount } from 'solid-js';
import { Marked } from '@ts-stack/markdown';
import { FileUpload } from '../Bot';
import { cloneDeep } from 'lodash';

type Props = {
  apiHost?: string;
  chatflowid: string;
  chatId: string;
  agentName: string;
  agentMessage: string;
  agentArtifacts?: FileUpload[];
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  renderHTML?: boolean;
};

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';
const defaultFontSize = 16;

export const AgentReasoningBubble = (props: Props) => {
  let botMessageEl: HTMLDivElement | undefined;
  Marked.setOptions({ isNoP: true, sanitize: props.renderHTML !== undefined ? !props.renderHTML : true });

  onMount(() => {
    if (botMessageEl) {
      const agentMessageString = typeof props.agentMessage === 'string' ? props.agentMessage : JSON.stringify(props.agentMessage);
      
      botMessageEl.innerHTML = Marked.parse(`**✅ ${props.agentName}** \n\n${agentMessageString}`);
      botMessageEl.querySelectorAll('a').forEach((link) => {
        link.target = '_blank';
      });
    }
  });

  const agentReasoningArtifacts = (artifacts: FileUpload[]) => {
    const newArtifacts = cloneDeep(artifacts);
    for (let i = 0; i < newArtifacts.length; i++) {
      const artifact = newArtifacts[i];
      if (artifact && (artifact.type === 'png' || artifact.type === 'jpeg')) {
        const data = artifact.data as string;
        newArtifacts[i].data = `${props.apiHost}/api/v1/get-upload-file?chatflowId=${props.chatflowid}&chatId=${props.chatId}&fileName=${data.replace(
          'FILE-STORAGE::',
          '',
        )}`;
      }
    }
    return newArtifacts;
  };

  const renderArtifacts = (item: Partial<FileUpload>) => {
    if (item.type === 'png' || item.type === 'jpeg') {
      const src = item.data as string;
      return (
        <div class="flex items-center justify-center max-w-[128px] mr-[10px] p-0 m-0">
          <img class="w-full h-full bg-cover" src={src} />
        </div>
      );
    } else if (item.type === 'html') {
      const src = item.data as string;
      return (
        <div class="mt-2">
          <div innerHTML={src} />
        </div>
      );
    } else {
      const src = item.data as string;
      // Ensure src is always a string before parsing markdown
      const srcString = typeof src === 'string' ? src : JSON.stringify(src);

      // Enhance: render discount badges for patterns like "23.5% OFF"
      const discountBadgeStyle = [
        'margin-left:1px',
        'padding:2px 8px',
        'background-color:#F0FDF4',
        'color:#166534',
        'border:1px solid #86EFAC',
        'border-radius:9999px',
        'font-weight:600',
        'font-size:0.85em',
        'white-space:nowrap',
      ].join(';');
      const discountPattern = /(\s[-–]\s*)(\d+(?:\.\d+)?)%\s*OFF/gi;
      const processedHtml = Marked.parse(srcString).replace(discountPattern, (_m, _s, num) => {
        return ` <span class="discount-badge" style="${discountBadgeStyle}">${num}% OFF</span>`;
      });

      return (
        <span
          innerHTML={processedHtml}
          class="prose"
          style={{
            'background-color': props.backgroundColor ?? defaultBackgroundColor,
            color: props.textColor ?? defaultTextColor,
            'border-radius': '6px',
            'font-size': props.fontSize ? `${props.fontSize}px` : `${defaultFontSize}px`,
          }}
        />
      );
    }
  };

  return (
    <div class="mb-6">
      {props.agentArtifacts && (
        <div class="flex flex-row items-start flex-wrap w-full gap-2">
          <For each={agentReasoningArtifacts(props.agentArtifacts)}>
            {(item) => {
              return item !== null ? <>{renderArtifacts(item)}</> : null;
            }}
          </For>
        </div>
      )}
      {props.agentMessage && (
        <span
          ref={botMessageEl}
          class="prose"
          style={{
            'background-color': props.backgroundColor ?? defaultBackgroundColor,
            color: props.textColor ?? defaultTextColor,
            'font-size': props.fontSize ? `${props.fontSize}px` : `${defaultFontSize}px`,
          }}
        />
      )}
    </div>
  );
};
