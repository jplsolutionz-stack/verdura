# Motion: estado

**Vídeo Higgsfield: pendente.** Nenhum vídeo foi gerado.

## Tentativas (27/10/2026)

- Não havia integração Higgsfield no ambiente (MCP, CLI ou chave de API). A geração foi tentada pelo site higgsfield.ai.
- Kling 3.0, Seedance 2.0 (54 créditos) e Seedance 2.0 Mini (12 créditos) mostraram "Upgrade required: Plus or higher". Nenhum crédito foi gasto e nada foi comprado.

## O que o site faz hoje

A jornada usa os 17 quadros estáticos (`src/data/journey.ts`) com transições no front-end:

- Obra (câmera fixa): fundações, base, paredes e cobertura sobem do chão com máscara de borda suave; acabamentos e casa pronta entram em fade.
- Aproximação: cada quadro chega crescendo até o lugar enquanto o anterior continua avançando, sugerindo o movimento da câmera.
- Porta: entreaberta e aberta em fade com a câmera parada.
- Revelação: o vão da porta no quadro 17 é recortado da camada de fotos (`clip-path: polygon(evenodd, …)`); o site real aparece por ele e o vão se expande até a tela toda.

## Quando o vídeo existir

Seguir `MOTION-HIGGSFIELD.md` do pacote: dez trechos de obra e seis de aproximação com primeiro/último quadro (Kling O3 First/Last Frame ou equivalente), reutilizando o mesmo quadro nas emendas. Extrair uma sequência de frames do master para o scrub e manter a revelação da porta no front-end.
