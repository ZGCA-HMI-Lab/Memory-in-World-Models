<div align="center">

# 世界模型记忆

**世界模型中记忆研究的论文分类索引**

[English](README.md)

</div>

本仓库整理世界模型如何保存和利用过去的信息：记忆存在哪里、如何维护和学习、如何评测，以及用在哪些世界模型上。前四个一级分类沿用综述 [The Past Frames the Future: Memory for Autoregressive Video Generation](https://arxiv.org/abs/2609.28466) 的分析维度，第五类按世界模型的类型划分。目前收录 237 篇论文和 5 篇综述。

## 目录

- [交互地图](#交互地图)
- [论文分类](#论文分类)
- [综述](#综述)

## 交互地图

[交互地图](https://zgca-hmi-lab.github.io/Memory-in-World-Models/)按分类和月份排列全部论文，点选一篇论文可以看到它在同一分类里沿用了哪些工作、又被哪些工作沿用。分类见 [`docs/taxonomy.json`](docs/taxonomy.json)。

## 论文分类

论文按末端分类归类，每篇只有一个主分类；面向具体任务的世界模型（世界动作、导航、具身视频）即使贡献在记忆机制上，也先归入记忆应用。同时涉及的其他类别写在 TL;DR 末尾的“相关”中。方括号里的编号由“分类标签.论文序号”组成，例如 `[MR.Visual.2]` 属于 `MR.Visual`（视觉记忆）；没有二级分类的直接用一级标签，例如 `[ME.3]`。序号只用于识别，不表示论文质量。标“基础”的是本身不以记忆为贡献、但理解该方向需要的模型或通用基准。

### Memory Representation｜记忆表示

记忆存在什么载体里：历史帧、模型内部状态、显式的世界状态，或在线更新的参数。对应综述第 3 章（Forms）。

#### Visual Memory｜视觉记忆 `[MR.Visual]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MR.Visual.24] | OneStory: Coherent Multi-Shot Video Generation with Adaptive Memory — Zhao-Chong An et al. | 把多镜头视频生成改写为逐镜头的自回归生成，从先前镜头中挑选语义相关的信息帧构成全局记忆，再按重要性分块压缩为紧凑上下文作条件。　相关：记忆管理 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.07802) |
| [MR.Visual.23] | ActionRoPE: action as coordinates for spatially consistent control in planar-camera game world models — Zhi-Yang Deng et al. | 面向俯视、等距等平面相机游戏，把动作引起的相机位移转为世界坐标下的旋转位置编码，使同一世界位置的token在不同时刻保持相同位置地址，并按已观测区域与新暴露区域分配逐token去噪调度。 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.25861) |
| [MR.Visual.22] | GLIMPSE: Global-Local Indexing with Multi-Precision Spectral Encoding for Explorable Video World Models — Zhu-Feng Xu et al. | 针对回访时投影误差造成的重影，将局部补丁记忆与循环全局记忆结合，用分频段多精度坐标和几何条件的频谱衰减为历史补丁寻址，并按覆盖足迹在固定读取预算下检索。　相关：隐式状态记忆、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.13706) |
| [MR.Visual.21] | FrameMorrow: Future-guided Frame Selection with Prospective Tokens for Long-Horizon Video Generation — Bo Yin et al. | 预测少量代表未来信息需求的前瞻token，用它们从生成历史中挑选相关的显式帧作为条件，可即插即用于多种生成器。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.38839) |
| [MR.Visual.20] | Geometry as Address: Routing Attention to Visual Memory for Long-Horizon Camera-Controlled Video Generation — Ze-Song Yang et al. | 将历史观测保留为帧latent而不融合成全局三维表示，仅用逐帧几何建立与目标视角的token级对应作为读取地址，通过几何对应注意力注入匹配的历史特征，并用不可见八叉树剔除被遮挡的对应。　相关：显式状态记忆、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.34722) |
| [MR.Visual.19] | ConsistWorld: Evidence Routing for Consistent Multi-Agent World Models — Qian-Xun Xu et al. | 多智能体自回归视频世界模型，把一致性视为证据路由：按位姿从所有智能体的历史观测中检索相关帧，并按历史覆盖和当前视野重叠门控同伴视角信息。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.22641) |
| [MR.Visual.18] | LongLive-RAG: A General Retrieval-Augmented Framework for Long Video Generation — Qi-Xing Hu et al. | 把自回归长视频生成表述为检索增强生成，每生成一块就用查询嵌入从已生成的latent中检索相关历史作条件，并用窗口时间差损失让嵌入关注有意义的时间变化。　相关：记忆感知学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.02553) |
| [MR.Visual.17] | WorldExplorer: Towards Generating Fully Navigable 3D Scenes — Manuel Schneider et al. | 从360度全景出发沿预设短轨迹迭代生成视频以扩展场景，用场景记忆为每段视频检索最相关的历史视角作条件，最后融合为三维高斯场景。 | SIGGRAPH 2025 | [论文](https://arxiv.org/abs/2506.01799) |
| [MR.Visual.16] | StreamingT2V: Consistent, Dynamic, and Extendable Long Video Generation from Text — Roberto Henschel et al. | 文生长视频的自回归方法：短期记忆模块用注意力读取上一片段的特征以衔接片段，长期记忆模块从首个片段提取场景与物体特征，防止遗忘初始场景。　相关：记忆管理 | arXiv 2024 | [论文](https://arxiv.org/abs/2403.14773) |
| [MR.Visual.15] | Matrix-Game 3.5: Enhancing Real-Time Streaming Interactive World Models with Patch Memory — Runjia Qian et al. | 以潜变量块为记忆单元，按深度重投影到目标视角并用平铺 PRoPE 编码相机，静动态分离建模，并蒸馏成实时因果生成器。　相关：显式状态记忆、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.29910) |
| [MR.Visual.14] | Closing the Loop: Training-Free Revisit Consistency for Autoregressive Generative Rendering — Wenchao Ma et al. | 免训练：按位姿匹配把历史潜变量块取回 KV 缓存作回环记忆，并用深度重投影把注意力偏向几何对应区域，改善回访一致性。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.21848) |
| [MR.Visual.13] | Retrieve What's Missing: Coverage-Maximizing Retrieval for Consistent Long Video Generation — Minseok Joo et al. | 用预训练 3D 先验估深度构建目标视角覆盖图，按剩余覆盖增益迭代选取历史帧，并用滑窗深度缓存控制开销。 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.02479) |
| [MR.Visual.12] | Memorize When Needed: Decoupled Memory Control for Spatially Consistent Long-Horizon Video Generation — Yanjun Guo et al. | 把记忆条件解耦为独立轻量分支，每帧经交叉注意只接收空间相关的历史信息，并用相机感知门控仅在有可用历史时启用记忆。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.18215) |
| [MR.Visual.11] | Lyra 2.0: Explorable Generative 3D Worlds — Tianchang Shen et al. | 保存逐帧几何，仅用于检索相关历史帧并建立与目标视角的稠密对应；配合自增强历史训练抑制漂移，生成可重建为 3D 的长视频。　相关：记忆学习、显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.13036) |
| [MR.Visual.10] | MemCam: Memory-Augmented Camera Control for Consistent Video Generation — Xinhang Gao et al. | 把已生成帧作外部记忆，压缩成紧凑表示并按共视关系选取相关帧作条件，改善大角度相机旋转下长视频的场景一致性。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.26193) |
| [MR.Visual.9] | I3DM: Implicit 3D-aware Memory Retrieval and Injection for Consistent Video Scene Generation — Jia Li et al. | 借前馈新视角合成模型的特征给历史帧打分检索，再将其隐式对齐到目标视角并按可靠区域注入，改善遮挡下的回访一致性。 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.23413) |
| [MR.Visual.8] | MosaicMem: Hybrid Spatial Memory for Controllable Video World Models — Wei Yu et al. | 把图像块提升到 3D 定位并按目标视角取回，拼成与查询视角对齐的块马赛克作条件，保留应持续的内容、让模型补全变化部分。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.17117) |
| [MR.Visual.7] | UCM: Unified Modeling of Camera Control and Memory with Time-aware Positional Encoding Warping for World Models — Tianxing Xu et al. | 用时间感知的位置编码变换把历史帧对齐到目标相机，统一长期记忆与相机控制，并用点云渲染模拟回访来构造大规模训练数据。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.22960) |
| [MR.Visual.6] | Geometry-Aware Rotary Position Embedding for Consistent Video World Model — Chendong Xiang et al. | 把屏幕空间位置编码换成注入相机射线方向的几何感知 RoPE，并按几何线索稀疏关注相关历史帧，减轻回访时的几何漂移，并提出诊断套件 ViewBench。　相关：记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.07854) |
| [MR.Visual.5] | Plenoptic Video Generation — Xiao Fu et al. | 针对多视角生成式重渲染中幻觉区域不一致，自回归训练多入单出模型，按相机引导检索先前生成的视频作条件以同步各视角。　相关：记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.05239) |
| [MR.Visual.4] | VMem: Consistent Interactive Video Scene Generation with Surfel-Indexed View Memory — Runjia Li et al. | 用 3D 面元为历史视图建索引，按目标视角可见面元取回少量最相关视图作上下文，低成本保持交互式场景探索的一致性。　相关：显式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.18903) |
| [MR.Visual.3] | Context as Memory: Scene-Consistent Interactive Long Video Generation with Memory Retrieval — Jiwen Yu et al. | 把历史帧直接当记忆，按相机视场重叠挑选相关帧，沿帧维与待生成帧拼接作条件，提升交互式长视频的场景一致性。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.03141) |
| [MR.Visual.2] | VRAG: Learning World Models for Interactive Video Generation — Taiye Chen et al. | 为图生视频模型加入动作与全局状态条件，按智能体位置与朝向的相似度检索历史帧作上下文，减轻长程误差累积，并给出评测基准。　相关：记忆评测 | arXiv 2025 | [论文](https://arxiv.org/abs/2505.21996) |
| [MR.Visual.1] | WorldMem: Long-term Consistent World Simulation with Memory — Zeqi Xiao et al. | 针对长时世界模拟中回访不一致，维护带位姿和时间戳的历史帧记忆库，用按状态的记忆注意力取回相关帧以重建先前场景。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2504.12369) |

#### Implicit State Memory｜隐式状态记忆 `[MR.Implicit]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MR.Implicit.37] | SlotMemory: Object-Centric KV Memory for Streaming Long-Video Generation — Weijia Dou et al. | 流式视频扩散的以物体为中心的KV记忆，把键值空间分解为可复用的语义槽位，以槽位为地址存取高保真KV token，使实体在出画或提示切换后仍保持一致。 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.31033) |
| [MR.Implicit.36] | Attend Locally, Remember Linearly: Linear Attention as Cross-Frame Memory for Autoregressive Video Diffusion — Kun-Yang Li et al. | 把预训练自回归视频扩散模型改为混合注意力：帧内保留softmax注意力，帧间用门控循环线性注意力维护固定大小的状态作为跨帧记忆，且只在去噪完成后更新状态。 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.16579) |
| [MR.Implicit.35] | TinyHistory: Lightweight Video History Embeddings via Two-Stage Context Learning — Lvmin Zhang et al. | 为自回归视频扩散学习轻量的历史嵌入：先在大规模视频上以随机帧查询目标预训练历史编码器，再把它接入生成模型学习内容一致性，从而在有限显存内编码更长的历史。　相关：学习目标 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.23851) |
| [MR.Implicit.34] | Temporally Consistent Transformers for Video Generation — Wilson Yan et al. | 针对内容出画后再回访时被重新编造的问题，构建迷宫、Minecraft和室内扫描三个长程依赖视频数据集，并提出把输入序列压缩为少量嵌入、经时间Transformer建模后由空间MaskGit展开的生成模型。　相关：记忆评测 | arXiv 2022 | [论文](https://arxiv.org/abs/2210.02396) |
| [MR.Implicit.33] | Learning to Simulate Dynamic Environments With GameGAN — Seung Wook Kim et al. | 从游戏画面与键盘动作学习可交互的游戏模拟器，用记忆模块构建环境的内部地图，使回到已访问位置时画面保持一致，并解耦静态与动态成分。　相关：视频世界模型 | arXiv 2020 | [论文](https://arxiv.org/abs/2005.12126) |
| [MR.Implicit.32] | Velox: Spatial Memory Makes World Models Efficient — Qiuhong Shen et al. | 免训练的注意力路由，把历史块表示为带深度区间的相机视锥切片，按与当前块的视锥重叠调制各层的块重要性，只读取相关区域的上下文，缓解KV缓存增长带来的生成变慢。 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.22311) |
| [MR.Implicit.31] | Long-horizon Video Generation with Slot Memory Addressed By Region Tokens — Eren Çetin et al. | 用固定大小的槽位记忆兼顾有界存储与按空间回忆，写入由观测相机寻址、读取由渲染相机查询，并为每次读取给出置信度，供扩散模型决定在多大程度上信任检索内容。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.19257) |
| [MR.Implicit.30] | HLA-WM: Hybrid Linear Attention for Long-Horizon Video World Models — Zhuo-Kun Chen et al. | 针对Gated DeltaNet线性注意力的长程遗忘，免训练地缓存分块状态转移摘要，按相机几何检索与当前场景相关的历史分块，并重组为针对查询的循环状态。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.05739) |
| [MR.Implicit.29] | MosaiChunk: Compositing Spatio-Temporal Memory for Autoregressive Video Generation — Yi-Wen Zhang et al. | 冻结视频生成器，只训练轻量路由器在固定活跃记忆预算下从时空历史中挑选KV片段拼成马赛克，以恢复重现内容的细节，并构建回访基准RememBench。　相关：记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.02153) |
| [MR.Implicit.28] | Honeycomb: Constant-Size Scene Memory Representation for Video World Models — J. Shi et al. | 提出固定大小的HexMemory，用六个空间与时空平面存储场景特征；写入器把每段新生成内容编码为平面特征，随覆盖范围扩展对旧平面变形并按置信度融合，读取器从中取latent作为后续生成的条件。　相关：显式状态记忆、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.37690) |
| [MR.Implicit.27] | LayerRecall: A State-Conditioned Memory Router for Long-Horizon Consistency in Video Generation — Yixuan Ding et al. | 按当前状态从历史中检索相关K/V，只注入主干中对记忆敏感的层，其余层保持局部注意力，并用长上下文参考在预测空间监督有界记忆下的路由器。　相关：记忆感知学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.28460) |
| [MR.Implicit.26] | Streaming Multi-Agent Autoregressive Diffusion Model with World State Registers — Si-Cheng Mo et al. | 在多智能体流式视频扩散中加入跨智能体世界状态寄存器，用可学习token存储共享世界信息和各智能体状态，每段生成后更新，并以智能体状态、鸟瞰图和场景文本监督。　相关：学习目标、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.21594) |
| [MR.Implicit.25] | Walking in the Implicit: Interactive World Exploration via Neural Scene Representation — Zhiqi Li et al. | 把交互生成的展开变量从帧latent换成定长、可渲染的隐式场景状态NIS，由扩散Transformer根据未来相机轨迹和几何感知检索的历史演化该状态，再按位姿确定性渲染。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.30045) |
| [MR.Implicit.24] | CausalCine: Real-Time Autoregressive Generation for Multi-Shot Video Narratives — Yi-Hao Meng et al. | 把多镜头视频生成变为在线导演式的因果自回归生成，支持镜头切换和随时输入的提示，并提出内容感知记忆路由，按注意力相关度而非时间远近检索历史KV，在有限活跃记忆下保持跨镜头连贯。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.12496) |
| [MR.Implicit.23] | Memorize-and-Generate: Towards Long-Term Consistency in Real-Time Video Generation — Tianrui Zhu et al. | 把记忆压缩与帧生成拆成两个任务：训练记忆模型将历史压缩为紧凑KV cache，由独立生成器据此生成后续帧，并构建MAG-Bench检验历史记忆保持。　相关：记忆管理、记忆评测 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.18741) |
| [MR.Implicit.22] | MemFlow: Flowing Adaptive Memory for Consistent and Efficient Long Video Narratives — Sihui Ji et al. | 流式视频生成中，每生成一段前按该段文本提示检索最相关的历史帧来更新记忆库，生成时每个查询只激活记忆库中最相关的token，兼顾长上下文一致性与效率。　相关：记忆管理 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.14699) |
| [MR.Implicit.21] | VideoSSM: Autoregressive Long Video Generation with Hybrid State-Space Memory — Yi-Fei Yu et al. | 将自回归扩散与混合状态空间记忆结合：状态空间模型作为随序列演化的全局场景记忆，局部上下文窗口保留运动与细节，以线性开销维持分钟级视频的一致性。 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.04519) |
| [MR.Implicit.20] | Captain Safari: A World Engine — Yu-Cheng Chou et al. | 位姿条件的世界引擎，沿相机路径维护动态局部记忆，用检索器取出与位姿对齐的世界token作条件，在激进六自由度轨迹下保持三维结构稳定。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2511.22815) |
| [MR.Implicit.19] | Pack and Force Your Memory: Long-form and Consistent Video Generation — Xiaofei Wu et al. | 长视频生成中提出 MemoryPack，以文本和图像为全局引导、可学习地检索上下文，同时建模短期与长期依赖；另用单步近似的 Direct Forcing 缩小训练与推理差异。　相关：记忆状态分布 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.01784) |
| [MR.Implicit.18] | Mixture of Contexts for Long Video Generation — Shengqu Cai et al. | 把长视频生成视为长上下文记忆检索问题，用可学习的稀疏注意力路由让每个查询只关注少量相关历史片段和必选锚点，并以因果路由避免回环。 | arXiv 2025 | [论文](https://arxiv.org/abs/2508.21058) |
| [MR.Implicit.17] | Learning to Retrieve: Internalizing Memory Retrieval for Video World Models — JiaKui Hu et al. | 把部分自注意力换成门控线性注意、以其递归状态作记忆，相机条件门决定取什么，受重新可见信号监督的触发器决定何时取。　相关：记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.11444) |
| [MR.Implicit.16] | LOCI: Spatial Linear Memory for Streaming World Models — Ji Xia et al. | 一半网络块保留历史 KV，另一半用读写受相机投影几何调制的递归线性注意记忆，兼顾细节保留与有界显存。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.40222) |
| [MR.Implicit.15] | WorldCrafter: Consistent Video World Model with Implicit 3D-aware Memory — Wangbo Yu et al. | 由目标视角决定如何压缩多视角历史：联合训练的记忆编码器与位姿条件读出模块把历史整合为一组目标视角专属 token。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.24984) |
| [MR.Implicit.14] | Addressable Memory for Video World Models — Xindi Wu et al. | 针对超出训练时长后时间 RoPE 偏移越界、KV 缓存难以寻址，免训练地给压缩摘要槽分配分布内的虚拟位置，并提出长绕路后回访的评测 LoopBench。　相关：记忆管理、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.07408) |
| [MR.Implicit.13] | Compression and Retrieval: Implicit Memory Retrieval for Video World Models — Zhan Peng et al. | 用轻量上下文压缩网络压缩历史，经位置编码注入视角信息、以注意力计算隐式检索记忆，并构建 SceneFly 合成数据集。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.23105) |
| [MR.Implicit.12] | Geometry-Aware Implicit Memory for Video World Models — Zhengxuan Wei et al. | 用轻量编码器把变长历史压成定长记忆 token，训练时经可按相机查询的几何头从冻结基础模型蒸馏 3D 结构，并用信息引导剪枝限制编码开销。　相关：记忆学习、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.02436) |
| [MR.Implicit.11] | DecMem: Towards Minute-Long Consistent World Generation with Decoupled Memory — Zhenhao Yang et al. | 针对可学习记忆长程外推时的计算低效与注意力分散，用稀疏全局记忆按块 top-k 访问历史，再与锚定局部滑窗记忆门控融合。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.31336) |
| [MR.Implicit.10] | WorldKV: Efficient World Memory with World Retrieval and Compression — Jung Yi et al. | 免训练：存下被驱逐的 KV 块，按相机/动作对应取回放回注意力窗口，并按键相似度剪除冗余 token 以省存储，以约 2 倍吞吐达到或超过全 KV 的记忆保真。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.22718) |
| [MR.Implicit.9] | Out of Sight but Not Out of Mind: Hybrid Memory for Dynamic Video World Models — Kaijin Chen et al. | 针对动态主体出视野再出现时冻结或消失，把记忆压缩成 token，按时空相关性检索运动线索以保持其身份与运动，并构建含出入视野事件的 HM-World 数据集。　相关：记忆评测、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.25716) |
| [MR.Implicit.8] | Infinite-World: Scaling Interactive World Models to 1000-Frame Horizons via Pose-Free Hierarchical Memory — Ruiqi Wu et al. | 用与生成器联合训练的分层无位姿压缩器把历史潜变量递归蒸馏为定额表示，配合不确定性动作标注和回访密集微调，支撑千帧级交互。　相关：记忆学习、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.02393) |
| [MR.Implicit.7] | Flow Equivariant World Models: Memory for Partially Observed Dynamic Environments — Hansen Jin Lillemark et al. | 让潜在记忆随自身运动和推断的物体运动等变地平移变换，使视野外区域的信息随时间保持对齐，用于部分可观测动态环境的长程预测。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.01075) |
| [MR.Implicit.6] | Space-Aware World Models: Spatial Persistence Through Factored Scene Representations — Bruno Corcuera, Carlos Eiras-Franco, Brais Cancela | 把导航仿真分解为每回合从俯视地图推断一次的场景潜码、显式的动作条件智能体状态和渲染器，以提升回访时地标与几何的一致性。　相关：导航世界模型、显式状态记忆 | NeurIPS 2026 | [论文](https://openreview.net/forum?id=LIkrG4Xb53) |
| [MR.Implicit.5] | RELIC: Interactive Video World Model with Long-Horizon Memory — Yicong Hong et al. | 在 KV 缓存中用高度压缩、编码相对动作与绝对相机位姿的历史潜变量 token 作长时记忆，并经省内存自强迫蒸馏得到 14B、16 FPS 的实时交互模型。　相关：记忆学习、视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.04040) |
| [MR.Implicit.4] | Recurrent Autoregressive Diffusion: Global Memory Meets Local Attention — Taiye Chen et al. | 在每个 DiT 层注意力后加 LSTM 等循环层作定长全局记忆，配合重叠滑窗全注意保留局部细节，并消除训练推理差异。　相关：记忆学习 | arXiv 2025 | [论文](https://arxiv.org/abs/2511.12940) |
| [MR.Implicit.3] | StateSpaceDiffuser: Bringing Long Context to Diffusion World Models — Nedko Savov et al. | 用状态空间模型概括整段交互历史并将其特征注入扩散世界模型，弥补只看少量近期帧导致的遗忘，并提出重现已见内容的评测协议。 | arXiv 2025 | [论文](https://arxiv.org/abs/2505.22246) |
| [MR.Implicit.2] | Long-Context State-Space Video World Models — Ryan Po et al. | 用分块 SSM 扫描延长时间记忆，配合稠密局部注意保证相邻帧连贯，使视频世界模型以可接受的推理成本保留长程空间记忆。 | arXiv 2025 | [论文](https://arxiv.org/abs/2505.20171) |
| [MR.Implicit.1] | Mastering Memory Tasks with World Models — Mohammad Reza Samsami et al. | 把状态空间模型融入 DreamerV3 式世界模型（R2I），增强强化学习智能体的长期记忆与长程信用分配。　相关：记忆评测 | arXiv 2024 | [论文](https://arxiv.org/abs/2403.04253) |

#### Explicit State Memory｜显式状态记忆 `[MR.Explicit]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MR.Explicit.31] | MASS: Multiplayer World Models with Authoritative Shared State — Zi-Qi Cai et al. | 针对多人世界模型把世界状态与视角相关的视觉latent纠缠在一起的问题，由学习的逻辑引擎根据联合动作推进全局权威的类型化状态，作为唯一的循环记忆与同步基准，再由渲染引擎为任意相机生成视图。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.06257) |
| [MR.Explicit.30] | VideoMemory: Toward Consistent Video Generation via Memory Integration — Jin-Song Zhou et al. | 面向多镜头叙事视频的以实体为中心的框架，多智能体按剧本拆分镜头，从动态记忆库检索角色、道具和背景的视觉与语义描述作条件生成，并在每个镜头后更新记忆库；另构建多镜头一致性基准。　相关：视觉记忆、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.03655) |
| [MR.Explicit.29] | SceneScape: Text-Driven Consistent Scene Generation — Rafail Fridman et al. | 文本驱动的无尽视角生成，结合预训练文生图模型与单目深度，在线把生成帧融合进逐步构建的统一网格，并用测试时训练使当前深度与已合成的场景几何一致。 | arXiv 2023 | [论文](https://arxiv.org/abs/2302.01133) |
| [MR.Explicit.28] | UniState: Unifying Memory and Intervention for Controllable World Simulation — Jaeseok Jeong et al. | 把空间记忆与用户干预统一为同一个世界状态表示，用户直接在空间记忆中指定物体运动、另选相机轨迹观察结果，使干预造成的场景变化在后续生成中保持。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.25414) |
| [MR.Explicit.27] | Momentum: Persistent Dynamics for Video World Models — N. Savov et al. | 把演化中的场景表示为图中多组环视参考相机的同步视频，先联合生成这些视频作为场景动态的共享记忆，再让目标相机视频以其为条件，使离开视野的动态内容仍被表示并一致重现。　相关：视频世界模型、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.23423) |
| [MR.Explicit.26] | Mallea: Building, Steering, and Memorizing Worlds with Coding Agent — Xuan-Yi Liu et al. | 由编码智能体根据文本规划物体结构、属性和规则来构建代码世界模型，程序推进显式世界状态，物体纹理记忆保留并随物体变化调整外观，生成式渲染器结合当前结构与记忆的外观生成观测。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.21283) |
| [MR.Explicit.25] | StateCraft: Augmenting Video World Models with Abstract-State Reasoning — Lorenzo Venturoli et al. | 将可更新的抽象状态与视觉状态解耦，由语言模型追踪实体随动作的变化，再以该状态条件视频扩散模型生成当前画面，使不可见部分的变化得以保持。　相关：视频世界模型、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.19795) |
| [MR.Explicit.24] | Any Time, Any Space: A World-State-Centric Framework for Agentic Video Generation — Wei-Jie Wang et al. | 将剧本编译为带位置、相机和事件时间引用的镜头请求，生成前从注册静态几何的场景记忆和按场景、事件、时间索引的事件记忆中检索证据，生成后经审核与状态检查才将重建结果写回记忆。　相关：记忆管理、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.20571) |
| [MR.Explicit.23] | Totem: Object-Centric 3D Memory for World-Consistent Video Generation — Zi-Chen Wan et al. | 为选定物体各建一个对齐到共享世界坐标系、带独立状态的持久三维记忆，经双流三维条件与场景几何结合生成目标视角，并用物体记忆约束注意力以保持物体表面和相对布局。 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.15807) |
| [MR.Explicit.22] | Oneira: From Open-Ended Generation to Open-World Interaction in Video World Models — Xin-Di Yang et al. | 由编码智能体维护可扩展的显式世界状态表，读取状态、规划交互并写回结果，将新发现的物体纳入状态，再按相机轨迹渲染粗略条件视频交给视频生成器补全细节。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.01614) |
| [MR.Explicit.21] | WorldWeave: Growing Persistent Geometric Worlds for Video Generation — Yi-Fan Huang et al. | 把世界状态维护与视觉渲染解耦，通过持续外扩生成高程图并由智能体组织拼接场景，构建可扩展的显式3D结构记忆，视频生成只读取其几何而不回写。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.34221) |
| [MR.Explicit.20] | TourPhysics: Bringing Physics to World Models for Exploration and Manipulation from a Single Image — Xin Zhang et al. | 从单张图像和声明式物理配置出发，将确定性物理仿真与视频生成结合，分离模拟器状态、几何证据、生成控制和外观记忆的职责，并以参考锚定记忆按几何对应检索已接受的静态外观，减轻回访时的外观漂移。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.04911) |
| [MR.Explicit.19] | OctWorld: Long-Range World-Consistent Video Generation with Octree-Based 3D Mapping — Ze-Long Lv et al. | 用动态稀疏八叉树上的TSDF融合，把生成的画面与深度逐步并入分辨率随图像证据自适应的全局3D记忆OctMap，使长距离相机轨迹下的回访保持一致。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.03919) |
| [MR.Explicit.18] | StatePlay: State-Aware Game World Models for Mechanics-Consistent Generation — Zi-Jun Lin et al. | 游戏世界模型在生成画面的同时联合预测生命值、技能条、计时器等内部状态，用混合Transformer架构分设视觉与状态分支并相互交互，由预测状态引导帧生成，使生成符合游戏机制。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.26754) |
| [MR.Explicit.17] | MultiGen: Level-Design for Editable Multiplayer Worlds in Diffusion Game Engines — Ryan Po et al. | 为扩散游戏引擎引入独立于上下文窗口的显式外部记忆，由用户动作持续更新并在生成中查询，将生成拆为记忆、观测和动力学模块，支持可编辑关卡与多人共享世界。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.06679) |
| [MR.Explicit.16] | Geometry-as-context: Modulating Explicit 3D in Scene-consistent Video Generation to Geometry Context — Jia-Kui Hu et al. | 让自回归相机控制视频模型交替估计当前视角几何以重建三维场景、再修复由该场景渲染的新视角图像，加入相机门控注意力，并在训练中随机丢弃几何上下文，使推理时可只输出RGB。 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.21929) |
| [MR.Explicit.15] | 3D Scene Prompting for Scene-Consistent Camera-Controllable Video Generation — Joungbin Lee et al. | 同时以时间相邻帧和空间相邻内容为条件，并用带动态掩码的SLAM从整段输入视频提取仅含静态几何的三维场景记忆，投影到目标视角作空间提示。　相关：视觉记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.14945) |
| [MR.Explicit.14] | Persistent Planar Memory for Video World Models — Yuze He et al. | 以平面图元作持久 3D 记忆：每个自回归块同时预测 RGB 与平面几何并合并进平面记忆，再经渲染深度条件后续生成，比逐像素点云紧凑约三个数量级。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.23795) |
| [MR.Explicit.13] | 4LC: 4D Latent Cache for Efficient Conditioning in Dynamic World Modeling — Jianhui Zhang et al. | 构建 4D 潜在缓存，把多种编码器表征绑定到共享几何与运动，可按任意时间与视角直接读取作条件，免去渲染与重编码。　相关：视觉记忆、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.17625) |
| [MR.Explicit.12] | MoVerse: Real-Time Video World Modeling with Panoramic Gaussian Scaffold — Yang Zhou et al. | 把窄视场单图扩成 360° 全景并提升为持久 3D 高斯骨架作空间记忆，再由高斯条件渲染器沿相机轨迹实时生成视频。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.13376) |
| [MR.Explicit.11] | Latent Spatial Memory for Video World Models — Weijie Wang et al. | 把场景记忆存为扩散潜空间的 3D 缓存：按深度反投影潜变量建图、在潜空间直接变换出新视角，免去像素渲染与重编码。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.09828) |
| [MR.Explicit.10] | LiveWorld: Simulating Out-of-Sight Dynamics in Generative Video World Models — Zicheng Duan et al. | 针对物体离开视野后状态被冻结，维护静态 3D 背景加持续演化的动态实体，用监视器模拟视野外进展并在回访时同步，并提出评测基准 LiveBench。　相关：视频世界模型、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.07145) |
| [MR.Explicit.9] | Beyond Pixel Histories: World Models with Persistent 3D State — Samuel Garcin et al. | 让世界模型模拟潜在 3D 场景（环境、相机、渲染器）的演化，由持久 3D 状态合成新帧，并支持在 3D 中编辑环境。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.03482) |
| [MR.Explicit.8] | WorldStereo: Bridging Camera-Guided Video Generation and Scene Reconstruction via 3D Geometric Memories — Yisu Zhang et al. | 以增量更新的点云全局记忆给出相机控制与结构先验，以空间立体记忆按 3D 对应约束注意力取细节，连接视频生成与重建。 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.02049) |
| [MR.Explicit.7] | AnchorWeave: World-Consistent Video Generation with Retrieved Local Spatial Memories — Zun Wang et al. | 用多个干净的局部几何记忆替代易错位的全局重建，按目标轨迹覆盖度检索局部记忆，并由多锚编织控制器调和跨视角不一致。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.14941) |
| [MR.Explicit.6] | Spatia: Video Generation with Updatable Spatial Memory — Jinjing Zhao et al. | 以 3D 场景点云作持久空间记忆，逐段生成视频并用视觉 SLAM 持续更新，动静分离以兼顾空间一致与动态实体生成。 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.15716) |
| [MR.Explicit.5] | EvoWorld: Evolving Panoramic World Generation with Explicit 3D Memory — Jiahao Wang et al. | 从单张全景图出发，交替生成全景视频并用前馈模型更新 3D 重建，再以其在目标视角的重投影作条件，保持长程探索的空间一致，并提出侧重回环的探索基准。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.01183) |
| [MR.Explicit.4] | Video World Models with Long-term Spatial Memory — Tong Wu et al. | 把生成帧重建并融合成只含静态部分的 TSDF 点云作长期空间记忆，沿目标轨迹渲染作条件，配合近期帧工作记忆和稀疏关键帧情景记忆，缓解回访时的场景遗忘。　相关：视觉记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.05284) |
| [MR.Explicit.3] | Voyager: Long-Range and World-Consistent Video Diffusion for Explorable 3D Scene Generation — Tianyu Huang et al. | 联合生成对齐的 RGB 与深度视频，维护带点剔除的点云世界缓存自回归扩展，从单图生成可沿自定义轨迹探索的 3D 场景。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.04225) |
| [MR.Explicit.2] | DeepVerse: 4D Autoregressive Video Generation as a World Model — Junyi Chen et al. | 让 4D 交互世界模型同时预测几何，并把以往时刻的几何预测纳入当前动作条件预测，减轻漂移并支持几何感知的记忆检索。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.01103) |
| [MR.Explicit.1] | GEN3C: 3D-Informed World-Consistent Video Generation with Precise Camera Control — Xuanchi Ren et al. | 用预测深度把输入或已生成帧升为点云 3D 缓存，沿用户相机轨迹渲染作条件生成，实现精确相机控制与 3D 一致。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2503.03751) |

#### Adaptive Parametric Memory｜自适应参数记忆 `[MR.Param]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MR.Param.5] | One-Minute Video Generation with Test-Time Training — Karan Dalal et al. | 在预训练Transformer中加入测试时训练（TTT）层，其隐藏状态本身是神经网络，用更具表达力的状态承载长上下文，按文本分镜生成一分钟视频。 | arXiv 2025 | [论文](https://arxiv.org/abs/2504.05298) |
| [MR.Param.4] | World-T3: Test-Time Training as Persistent Memory for Real-Time Video World Models — Junyi Wu et al. | 在每个 DiT 层加测试时训练记忆：用递归最小二乘按位姿键把挤出窗口的特征写入快权重，再按目标位姿读出。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.17434) |
| [MR.Param.3] | Towards Memory-Efficient Autoregressive Video Generation via Instance-Specific Parametric Absorption — Xiaomeng Fu et al. | 把部分层从全注意改为局部注意，闭式求解最小二乘得到实例专属权重调制以吸收丢弃的历史 KV，最多去掉一半 KV 缓存而画质近乎无损。　相关：记忆管理、隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.00712) |
| [MR.Param.2] | Composition of Memory Experts for Diffusion World Models — Sebastian Stapf et al. | 以对比式专家乘积组合短期、长期与空间三类记忆专家，其中长期专家经轻量测试时微调把情景历史存入独立扩散模型权重。　相关：隐式状态记忆、显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.18813) |
| [MR.Param.1] | SlowFast-VGen: Slow-Fast Learning for Action-Driven Long Video Generation — Yining Hong et al. | 慢学习预训练动作条件视频扩散模型，推理时快学习用局部输入输出更新时序 LoRA 存储情景记忆，并以慢快学习循环结合二者。　相关：记忆学习、视频世界模型 | arXiv 2024 | [论文](https://arxiv.org/abs/2410.23277) |

### Memory Operations｜记忆操作

推理时记忆如何维护。只有记忆管理（在有限预算下保留、压缩或丢弃什么）单设类别；读取与注入方面的工作按所用的记忆表示归类。

#### Memory Management｜记忆管理 `[MO.Manage]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MO.Manage.28] | PackForcing: Short Video Training Suffices for Long Video Sampling and Long Context Inference — Xiaofeng Mao et al. | 把自回归视频生成的历史KV分为三部分：全分辨率保留的汇点token、经双分支网络大幅压缩并按top-k动态选取的中段token、全分辨率的近期token，并用时间RoPE调整弥合丢弃token留下的位置间隔。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.25730) |
| [MO.Manage.27] | Relax Forcing: Relaxed KV-Memory for Consistent Long Video Generation — Zengqun Zhao et al. | 分析自回归长视频推理中KV记忆的数量与时间位置对运动的影响，提出免训练的记忆结构：汇点帧提供全局稳定，尾部帧保持短期连贯，并按松弛准则挑选与全局锚点对齐、与近期内容不冗余的历史帧。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.21366) |
| [MO.Manage.26] | Rolling Sink: Bridging Limited-Horizon Training and Open-Ended Testing in Autoregressive Video Diffusion — Haodong Li et al. | 把超出训练时长后的退化归因于缓存内容与训练时不一致，提出免训练的推理时缓存策略：在固定预算内保留低漂移内容与少量近期上下文，并滑动时间索引、调度语义。 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.07775) |
| [MO.Manage.25] | Quant VideoGen: Auto-Regressive Long Video Generation via 2-Bit KV-Cache Quantization — Hao-Cheng Xi et al. | 针对自回归视频扩散中KV cache占满显存、限制有效工作记忆的问题，提出免训练的2比特KV cache量化：用语义感知平滑得到便于量化的残差，再以由粗到细的渐进残差量化降低误差。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.02958) |
| [MO.Manage.24] | Fast Autoregressive Video Diffusion and World Models with Temporal Cache Compression and Sparse Attention — Dvir Samuel et al. | 自回归视频扩散与世界模型的免训练注意力框架：按帧间时间对应压缩 KV cache 以限制其增长，并用近似最近邻选取相关提示词与键，稀疏化交叉注意力和自注意力。 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.01801) |
| [MO.Manage.23] | Past- and Future-Informed KV Cache Policy with Salience Estimation in Autoregressive Video Diffusion — Han-Mo Chen et al. | 针对自回归视频扩散中启发式KV cache策略忽视token重要性的问题，用从双向教师蒸馏的轻量显著性估计头为token打分，保留重要token并淘汰冗余token。　相关：记忆感知学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.21896) |
| [MO.Manage.22] | PackCache: A Training-Free Acceleration Method for Unified Autoregressive Video Generation via Compact KV-Cache — Kun-Yang Li et al. | 统一自回归视频生成的免训练 KV cache 管理：保留文本与条件图像作语义锚点，按与当前帧的时间距离分配缓存预算，并在删除缓存后保持三维位置编码连贯。 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.04359) |
| [MO.Manage.21] | Reward Forcing: Efficient Streaming Video Generation with Rewarded Distribution Matching Distillation — Yunhong Lu et al. | 针对流式视频生成过度依赖静态汇点token而复制首帧的问题，用指数滑动平均把滑出窗口的token持续融入固定大小的汇点token，并以视觉语言模型评定的运动奖励加权分布匹配蒸馏。　相关：隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.04678) |
| [MO.Manage.20] | CORAL-KV: Compact Cross-Layer Prediction and Residual Coding for Autoregressive Video KV Caches — Albert Ge et al. | 利用视频KV cache的跨层依赖，用每层缓存预测下一层的键值并只量化预测残差，以块对角加低秩预测器压缩自回归视频生成的KV cache。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.12514) |
| [MO.Manage.19] | Keepsake: Selective Spatial Memory for Long-Horizon Video Generation — Abdul Mohaimen Al Radi et al. | 免训练的固定容量空间记忆控制器，在保留帧与新帧上构建位姿-外观图，按可替代视图的数量和最近替代的相似度持续重估每帧的价值，淘汰最容易被替代的观测。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.06588) |
| [MO.Manage.18] | DeCoPrune: Efficient KV-Cache Pruning for Autoregressive Video Diffusion via Denoising Consistency — Ze-Qi Xiao et al. | 把KV cache压缩视为去噪一致性问题，以token中间预测与最终去噪结果的差异衡量其信息价值，保留难以从已有上下文预测的token，并构建需回忆早先物体或场景的基准评测信息保留。　相关：隐式状态记忆、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.39096) |
| [MO.Manage.17] | QuantWM: Temporally Consistent 2-Bit KV Cache Quantization for Video World Models — Jia-Qi Zhao et al. | 针对视频世界模型中不断增长的KV cache做免训练2比特量化，通过保持注意力logit和时空token选择，避免量化Key导致的闪烁与画质退化。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.26425) |
| [MO.Manage.16] | RECAP-Forcing: Retaining Content Appearances for Long Video Generation — Hai-Yang Xu et al. | 按外观新颖性而非时间远近组织记忆：在新主体、去遮挡区域或新场景首次出现时保留其KV缓存，开头用注意力汇点保存初始场景，之后由基于光流的新颖性库选择性保留新内容，无需训练。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.26671) |
| [MO.Manage.15] | Persistent Computational State: A Session-Centric Runtime for Generative World Models — Zhen Lin | 指出世界模型回访失败部分源于请求式服务丢弃了运行时状态，定义必须跨请求保留的最小不可重算状态，并据此构建支持快照与恢复的会话式运行时。　相关：记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.21686) |
| [MO.Manage.14] | Surprise Forcing: What to Remember, When to Skip in Long Video Generation — Shu-Wei Shi et al. | 免训练的流式自回归视频生成框架，把被淘汰的帧概括为value token描述子，按新颖度信号和反馈控制的预算决定准入与替换，并按块难度跳过部分去噪步。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.18436) |
| [MO.Manage.13] | PermaVid: Consistent Video Generation Across Edits via Disentangled Context Memory — Shuai Yang et al. | 针对编辑后存储的上下文过时或失效，把空间上下文拆成RGB外观记忆和仅含几何的深度记忆，用编辑感知的记忆更新与检索让记忆随后续观测演化。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.16449) |
| [MO.Manage.12] | MilliVid: Hierarchical Latents for Long-Range Consistency in Video Generation — I. Chandratreya et al. | 把每帧编码为从完整潜变量到少量token的层级表示，按由粗到细展开生成，并控制历史帧以何种细节层级作上下文，以保持长程几何与物体持续性。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.09056) |
| [MO.Manage.11] | Light Interaction: Training-Free Inference Acceleration for Interactive Video World Models — Jia-Cheng Lu et al. | 免训练的交互式视频世界模型加速框架，按相机轨迹自适应管理上下文，探索新区域时丢弃检索的空间记忆、回访时复用早期去噪输出，并结合三维块稀疏注意力。 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.31158) |
| [MO.Manage.10] | Head Forcing: Long Autoregressive Video Generation via Head Heterogeneity — Jia-Hao Tian et al. | 发现自回归视频扩散模型的注意力头分为局部、锚点和记忆三类，为每类分配不同的 KV cache 策略，记忆头使用带情景更新的分层记忆，无需训练即可延长生成。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.14487) |
| [MO.Manage.9] | MemRoPE: Training-Free Infinite Video Generation via Evolving Memory Tokens — Youngrae Kim et al. | 免训练的无限视频生成框架，用指数滑动平均把全部历史键压缩进长短期两路固定大小的记忆token，并缓存未旋转的键、在注意力计算时再施加位置编码，避免聚合时的位置相位冲突。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.12513) |
| [MO.Manage.8] | Deep Forcing: Training-Free Long Video Generation with Deep Sink and Participative Compression — Jung Yi et al. | 针对自回归视频扩散的免训练KV cache管理：Deep Sink把一半滑动窗口留给持久的sink token并重新对齐其时间RoPE，参与式压缩只保留参与近期注意力的token，丢弃冗余与退化的历史。　相关：隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.05081) |
| [MO.Manage.7] | Rolling Forcing: Autoregressive Long Video Diffusion in Real Time — Kun-Hao Liu et al. | 流式长视频生成中，以噪声递增的多帧联合去噪抑制误差传播，并用注意力汇点保留初始帧的 KV 作为全局锚点，以保持长程一致性。　相关：记忆状态分布 | arXiv 2025 | [论文](https://arxiv.org/abs/2509.25161) |
| [MO.Manage.6] | LongLive: Real-time Interactive Long Video Generation — Shuai Yang et al. | 帧级自回归长视频生成框架，用短窗口注意力配合帧级注意力汇点保留长程一致性，以KV重缓存应对提示切换，并通过流式长序列微调对齐训练与推理。　相关：记忆状态分布、隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2509.22622) |
| [MO.Manage.5] | Frame Context Packing and Drift Prevention in Next-Frame-Prediction Video Diffusion Models — Lvmin Zhang et al. | 为逐帧预测视频扩散模型按帧重要性压缩历史上下文，越重要的帧保留越长的上下文，并用提前确定端点、调整采样顺序和离散历史表示抑制漂移。　相关：记忆状态分布 | arXiv 2025 | [论文](https://arxiv.org/abs/2504.12626) |
| [MO.Manage.4] | Long-Context Autoregressive Video Modeling with Next-Frame Prediction — Yu-Chao Gu et al. | 建立逐帧自回归视频建模基线FAR，并利用远帧主要充当上下文记忆的冗余，对远帧用大核非对称分块压缩token、近帧保留细节，降低长视频训练开销。　相关：隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2503.19325) |
| [MO.Manage.3] | Spatial Memory Intelligence: Endowing World Models with Understanding-Driven Long-Term Memory — Ying Yang et al. | 用微调的多模态大模型管理空间记忆：聚类、簇内稀疏化、动作感知检索和可靠性过滤，删去八成以上记忆仍改善回访一致性。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.02521) |
| [MO.Manage.2] | StableWorld: Towards Stable and Consistent Long Interactive Video Generation — Ying Yang et al. | 免训练的滑动窗口帧驱逐：用 ORB 几何相似度剔除同一场景中已漂移的冗余中间帧，保留干净早期帧，抑制长程误差累积。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.15281) |
| [MO.Manage.1] | WorldPack: Dynamic Frame Compression for Long-context Video World Modeling — Yuta Oshima et al. | 按与当前视锥的 3D 重叠给历史帧打分，相关帧少压缩、无关帧多压缩，在 4 帧预算内放入 22 帧历史，改善回访一致性。　相关：视觉记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.02473) |

### Memory Learning｜记忆学习

模型如何学会使用记忆：监督什么、训练时见到怎样的历史，以及按部署时的记忆限制来训练。

#### Learning Objectives｜学习目标 `[ML.Objective]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [ML.Objective.5] | Alaya-EVOKE: From Linear-Scaling Supervision to Endless World — Yuan-Yang Yin et al. | 把场景几何存入外部按相机索引的世界状态库、只检索与当前视角相关的部分，并设计稀疏注意力教师提供长程监督，在自展开下用分布匹配蒸馏给少步学生。　相关：显式状态记忆、记忆状态分布、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.13546) |
| [ML.Objective.4] | WorldCycle: Self-Verifiable Reinforcement Learning for Long-Horizon Video World Models — Bohai Gu et al. | 利用动作序列接其逆序列必回到初始状态这一性质，为交互式视频世界模型构造免标注的强化学习奖励，约束正反段对称与多次循环间的状态一致，并发布检验回到原状态能力的诊断基准CycleBench。　相关：记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.04964) |
| [ML.Objective.3] | Context Forcing: Consistent Autoregressive Video Generation with Long Context — Shuo Chen et al. | 指出用只看短窗口的教师蒸馏长上下文学生会造成监督错配，改用能看到完整生成历史的长上下文教师训练学生，并以Slow-Fast记忆管理线性增长的上下文。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.06028) |
| [ML.Objective.2] | Training Object Permanence in World Models — Haotian Zhang et al. | 人工设计 150 个认知科学启发任务，用 Blender 随机化渲染出 150 万样本的物体恒存训练集和 300 题测试，并训练 16B 世界模型。　相关：记忆评测、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.28654) |
| [ML.Objective.1] | Memory Forcing: Spatio-Temporal Memory for Consistent Scene Generation on Minecraft — Junchao Huang et al. | 用点云回溯源帧的几何索引空间记忆，配合混合训练与链式前向训练，让模型探索时靠近期帧、回访时用空间记忆。　相关：显式状态记忆、视觉记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.03198) |

#### Memory State Distribution｜记忆状态分布 `[ML.Dist]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [ML.Dist.2] | Frechet Forcing: Training Long-Horizon Streaming World Models from Short Clips — Yian Zhao et al. | 在模型自展开的 rollout 上用潜变量与感知统计的 Fréchet 距离约束场景保真与真实感，并加锚定流匹配；只用短片段微调，超过 4000 帧仍保持稳定。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.25666) |
| [ML.Dist.1] | Robust Dreamer: Deviation-Aware Latent Gaussian Memory for Action-Controlled AR Video Generation — Hanlin Chen et al. | 把扩散潜变量挂到高斯基元上做潜空间泼溅记忆，训练时注入按阶段和时间步存档的模型偏差，让生成器学会从带误差记忆中纠正。　相关：显式状态记忆、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.30855) |

#### Memory-Aware Learning｜记忆感知学习 `[ML.Aware]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [ML.Aware.5] | Memorizon: Training World Models Beyond Their Context Window — Ting-Ting Liao et al. | 让训练样本覆盖任意长的时间跨度但只对末尾若干块计损失，每块按相机共视检索历史latent组成有界记忆库，从而以有限注意力代价直接监督回访一致性。　相关：视觉记忆、记忆状态分布 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.00544) |
| [ML.Aware.4] | Ring Forcing: Towards Precise Long-Term Memory for Autoregressive Video Diffusion — Bowen Xue et al. | 针对自回归视频扩散的长期记忆，用环形训练强制模型从远历史检索以保证物体再现，并以压缩和时间步组合扩展历史跨度、以稀疏RoPE灵活适配记忆。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.26794) |
| [ML.Aware.3] | Learning What to Recall: Adaptive Multi-Cue Episodic Memory for World Models — Beomsu Kim et al. | 用回忆内容下真实未来的预测似然（以负扩散损失近似）训练检索器，按查询自适应决定信任时间、位姿、视觉、音频等哪类线索。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.34677) |
| [ML.Aware.2] | MemLearner: Learning to Query Context memory for Video World Models — Jiwen Yu et al. | 针对规则检索在遮挡和动态物体下失效，在历史与目标 token 间插入可学习查询 token，让生成模型学会取相关上下文。 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.31734) |
| [ML.Aware.1] | Teaching Video Generators to Remember: Eliciting Dynamic Memory for Out-of-Sight State Evolution — Tianshuo Xu et al. | ReMind 用记忆导向数据、事件感知课程和相机相位 RoPE，训练视频生成器跨越观察中断从 KV 缓存取回视野外状态。　相关：隐式状态记忆、视频世界模型 | NeurIPS 2026 | [论文](https://arxiv.org/abs/2605.25333) |

### Memory Evaluation｜记忆评测 `[ME]`

检验模型是否真的依赖先前所见的基准与对照研究，而不只是看长序列是否显得连贯。

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [ME.25] | Grid or Nodes? Probing Object Memory in World Models Under Partial Observability — Justin McMillen et al. | 在FloWM的方块世界中，将其按内置速度平移的空间特征网格记忆与逐物体记录位置和速度的节点记忆（借助真值的Kalman跟踪器）对照，考察视野外物体的记忆、读出方式和存储开销。　相关：隐式状态记忆、显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.18637) |
| [ME.24] | MultiWorldBench: Do Independently Controlled Views Describe One Shared World? — Zhan Xu et al. | 基于Minecraft的多人世界模型诊断基准，涵盖独立控制、共享状态同步、状态持续和延迟回访等能力，以游戏引擎真值为参照，检验各视角是否描述同一个持续的世界。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.11723) |
| [ME.23] | PROWBench: Do Video Models Render What the Program Specifies? — Zheng-Hui Huang et al. | （基础）以程序化构建的场景记录实体状态与带时间戳的事件（含视野外事件），据此检验生成视频是否遵循程序设定，评测实体控制、长程记忆与事件渲染。 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.02205) |
| [ME.22] | Can 4D Foundation Models Remember? — Guang-Zhao He et al. | 以360度视频作为全知真值，从物体持久性、运动连续性和外观保持三方面评测相机控制视频模型和四维重建模型对离开视野物体的记忆。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.20819) |
| [ME.21] | Does Video Memory Use What It Retrieves? A Causal Audit of Memory Specificity — Aditi Tiwari et al. | 提出读取时记忆替换，把模型读取的记忆值换成无关或错误内容而其余计算不变，以区分记忆带来的收益是否真正依赖检索到的内容，并用它审计多个冻结的视频世界模型与WorldMem。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.12090) |
| [ME.20] | Do Video Generators Track the World Across Segments? A Benchmark and Method for World-State Reasoning in Video Continuation — Ying-Mao Miao et al. | 提出Statebench，检验视频续写能否反映由历史视频和新提示共同决定的世界状态，涵盖过去可见、被遮挡过程和复杂转变三类状态；并提出显式维护、更新实体状态再以预测终帧引导生成的Stateagent。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.03673) |
| [ME.19] | Can Video World Models Track Unobserved World States? — Joonghyuk Shin et al. | 用动作条件的视频猜杯子游戏检验世界模型能否跟踪未观测状态，分析因果Transformer只追加的KV cache为何无法泛化到更长的交换序列，指出需要可修改的跨块状态，并比较线性注意力与非线性TTT快权重。　相关：隐式状态记忆、自适应参数记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.30692) |
| [ME.18] | PlayWorld: Benchmarking World Models with Agent Players over Long-Horizon Objectives — Kai Ding et al. | 用多模态智能体玩家为不同世界模型自行规划动作以完成长程目标，从几何一致性、交互保真、视野外演化与视野内演化等维度比较交互式视频世界模型。 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.13552) |
| [ME.17] | Execution Before Memory: Diagnosing Memory Failures in Video World Models — Weiyang Jin et al. | 提出 MIST，把场景建立、变化执行、结果呈现分开计分，发现记忆失败多因指令没执行，并用改写指令的 M3-Agent 补救。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.23542) |
| [ME.16] | WorldMemBench: A Comprehensive Benchmark for Memory of Video World Models — Nan Zhou et al. | 用受控相机离开与多次回访，在 260 个用例上评测人物、物体、环境的静态记忆和视野外事件的动态记忆。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.19063) |
| [ME.15] | OPIS: An Input-Grounded Benchmark for Multi-Object Memory in Video World Models — Hao Wang et al. | OPIS 以首帧标注的物体实例为准，从存在、身份、结构三层评测视频世界模型的多物体记忆，含 500 个用例。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.35052) |
| [ME.14] | R2M-Bench: Evaluating Revisit Memory via Relative Consistency in Interactive Video World Models — Qiwen Gu et al. | R2M-Bench 把每次回访与同一 rollout 中等间隔非回访对和短程对比较，得到相对记忆分，排除画面变化少带来的虚高。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.27328) |
| [ME.13] | Echo-Memory: A Controlled Study of Memory in Action World Models — Wayne King et al. | 固定骨干、训练与评测，只换记忆模块，对比原始上下文、压缩、空间摘要与状态空间递归，发现回放画质不能代表回访记忆。　相关：隐式状态记忆、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.09803) |
| [ME.12] | WorldRoamBench: An Open-World Benchmark for Long-Horizon Stability of Interactive World Models — Ting-Bing Xu et al. | 用千余个 10–60 秒连续操控用例，从动作、视觉漂移、物理和记忆四维评测交互世界模型的长程稳定性。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.31672) |
| [ME.11] | MemoBench: Benchmarking World Modeling in Dynamically Changing Environments — Haoyu Chen et al. | MemoBench 用 360 段合成与真实片段构建消失–再现用例：目标在视野外发生物理变化，检验模型再现时能否给出更新后的状态。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.27537) |
| [ME.10] | Current World Models Lack a Persistent State Core — Jinpeng Lu et al. | WRBench 把相机运动当作可观测性干预，按执行、在场连续、返回一致逐级评测 23 个模型，发现返回的目标停在离开时的状态。　相关：显式状态记忆、视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.20545) |
| [ME.9] | WBench: A Comprehensive Multi-turn Benchmark for Interactive Video World Model Evaluation — Kaining Ying et al. | （基础）WBench 以 289 个多轮交互用例和 22 个子指标，从画质、设定遵循、交互遵循、一致性和物理五维评测交互视频世界模型。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.25874) |
| [ME.8] | iWorld-Bench: A Benchmark for Interactive World Models with a Unified Action Generation Framework — Jianjie Fang et al. | 用动作生成框架统一不同交互方式，设计 6 类共 4.9k 个测试样本，评测 14 个世界模型的画质、轨迹跟随和往返回访记忆。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.03941) |
| [ME.7] | MBench: A Comprehensive Benchmark on Memory Capability for Video World Models — Shengjun Zhang et al. | MBench 把记忆分为实体、环境、因果三维 12 子项，用真实长视频加记忆触发指令，仅在模型确实执行触发时计分。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.00793) |
| [ME.6] | WorldMark: A Unified Benchmark Suite for Interactive Video World Models — Xiaojie Xu et al. | （基础）用逐模型适配器把统一的 WASD 指令转成各模型的控制格式，在 500 个用例上测动作响应、世界记忆与画质。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.21686) |
| [ME.5] | Out of Sight, Out of Mind? Evaluating State Evolution in Video World Models — Ziqi Ma et al. | STEVO-Bench 用插入遮挡、关灯或移开相机打断观察，检验视频世界模型在看不见时能否让倒水、融化等过程继续演化。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.13215) |
| [ME.4] | MIND: Benchmarking Memory Consistency and Action Control in World Models — Yixuan Ye et al. | MIND 提供第一/第三人称、多种动作空间下的 250 段闭环重访视频，评测世界模型的记忆一致性与动作控制，并给出基线。　相关：视频世界模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.08025) |
| [ME.3] | On Memory: A comparison of memory mechanisms in world models — Eli J. Laird et al. | 在 MemoryMaze 上用状态回忆任务，对比 Transformer 世界模型中 4 种记忆编码与 5 种注入方式的 20 种组合，mLSTM 编码配加性注入的回忆效果最好。　相关：隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.06983) |
| [ME.2] | LoopNav: Benchmarking Spatial Consistency in World Models — Kewei Lian et al. | 在 Minecraft 采集 250 小时带动作的回环导航视频，用场景图一致性分数评估世界模型回到原处时的空间一致性。　相关：视频世界模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2505.22976) |
| [ME.1] | Evaluating Long-Term Memory in 3D Mazes — Jurgis Pasukonis et al. | 提出随机 3D 迷宫 Memory Maze，配在线强化学习、离线数据集和探针任务，单独检验智能体能否记住物体位置与迷宫布局。　相关：隐式状态记忆 | arXiv 2022 | [论文](https://arxiv.org/abs/2210.13383) |

### Memory Applications｜记忆应用

按世界模型的类型整理记忆在其中的设计与使用：视频世界模型、世界动作模型、导航世界模型。

#### Video World Models｜视频世界模型 `[MA.Video]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MA.Video.39] | Programmable World Model — Zheng-Hui Huang et al. | 将世界状态演化与画面生成解耦：智能体把自然语言指令转成规定实体状态和转移规则的程序，由轻量引擎维护包括画外实体在内的显式持久世界状态，再把状态表示为带属性的三维有向包围盒，连同相机轨迹编译为像素对齐的时空条件，交给预训练视频模型渲染；另构建CombatStateBench。　相关：显式状态记忆、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.10540) |
| [MA.Video.38] | State World Models: Execute the Rules, Generate the Pixels — Yan-Ki Chan et al. | 把世界演化与视频渲染分离，按规则维护并更新显式世界状态，将每轮动作结果编译成指令交给冻结的视频模型渲染，并构建反事实孪生对基准检验依赖隐藏状态的规则遵从。　相关：显式状态记忆、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.26811) |
| [MA.Video.37] | PAWA: Panoramic Action-conditioned World Modeling for Multiple Agents — Si-Qi Yang et al. | 面向多玩家共享世界的动作条件建模，构建Minecraft中各玩家第一视角视频与世界对齐全景视频配对的数据集，用双塔模型联合预测两路视频，以全景表示视野外的环境变化。 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.20240) |
| [MA.Video.36] | Generative World Simulation with DAO and JING — Xgen Team Guohao Cai et al. | 用可计算的世界引擎按交互规则与世界时间维护人物、物体与空间的状态及关系，并为每个观察者导出条件，交给第一人称交互体验模型结合观测历史生成视听体验。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.19726) |
| [MA.Video.35] | WorldPlay2: Extending Real-Time Interactive World Models in Control and Horizon — Hai-Yu Zhang et al. | 实时交互世界模型，用分解式混合控制接口，把历史上下文压缩成自回归学生与双向教师共享的记忆token以逐片段蒸馏，并以Stable Forcing和整段回放稳定长程生成。　相关：隐式状态记忆、记忆状态分布 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.35560) |
| [MA.Video.34] | Code Plans, Diffusion Renders: Open-Ended Generative World Modeling — Zi-Xun Fang et al. | 用代码显式构建可执行的世界规则与动态，再由视频生成模型渲染观测，使世界状态在视野外持续演化并支持长期记忆与多智能体交互。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.26458) |
| [MA.Video.33] | Code World Model: Coding Agent as World Brain — Yiwen Chen et al. | 把世界演化与画面生成分离：编码智能体推理事件后果并生成可执行代码维护持久世界状态，再编译为逐帧时空约束的代理视频，条件化视频模型渲染画面。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.25927) |
| [MA.Video.32] | ABot-World-0: Infinite Interactive World Rollout on a Single Desktop GPU — Fan Jiang et al. | 可在单卡桌面GPU实时运行的动作条件视频世界模型，用LongForcing将学生的长自展开对齐到长时域教师以减少漂移，并以参考角色记忆保持第三人称身份一致。　相关：记忆状态分布、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.19191) |
| [MA.Video.31] | Advancing Open-source World Models — Ze-Lin Gao et al. | 从视频生成出发的开源交互式世界模拟器，在多种风格环境中保持动态真实，支持分钟级生成并维持上下文一致，即长期记忆，同时实现实时交互。 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.20540) |
| [MA.Video.30] | Yume: An Interactive World Generation Model — Xiaofeng Mao et al. | 交互式视频世界生成系统，从图像出发用键盘控制探索，以带记忆模块的掩码视频扩散Transformer自回归生成无限长视频，并配合相机运动量化、免训练采样改进与模型加速。 | arXiv 2025 | [论文](https://arxiv.org/abs/2507.17744) |
| [MA.Video.29] | Hunyuan-GameCraft: High-dynamic Interactive Game Video Generation with Hybrid History Condition — Jiaqi Li et al. | 面向游戏的交互式视频生成，把键鼠输入统一到相机表示空间，用混合历史条件训练自回归地延长视频并保留场景信息，再蒸馏以支持实时生成。　相关：记忆状态分布 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.17201) |
| [MA.Video.28] | Remembering What Matters for Long-Horizon Robotic World Models — Hao Wu et al. | 免训练的机器人视频世界模型上下文调度：只保留初始场景锚点与最近若干视觉-动作块，丢弃陈旧的生成历史。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.14583) |
| [MA.Video.27] | Multi-Agent Egocentric World Model with Fine-Grained Embodied Interaction — Dahyun Chung et al. | 多智能体第一人称世界模型，在共享token序列中联合去噪多路视角，以全体位姿与共享环境记忆保持世界一致。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.12299) |
| [MA.Video.26] | SPW-Nav: A Streaming Panoramic World Model for Language-Guided Navigation — Yunheng Liu et al. | 由语言指令驱动的流式全景世界模型，从单张全景实时生成一分钟2K 360°视频，用多项记忆延续场景。　相关：导航世界模型、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.08941) |
| [MA.Video.25] | World Observer: Joint Actor-Observer Generation for Persistent World Modeling — Hyunwook Choi et al. | 联合生成主体视角与全景观察者视频，使离开视野的物体在观察流中继续演化、重入时状态正确，并提出视野外评测。　相关：显式状态记忆、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.02162) |
| [MA.Video.24] | ReWorld: An Interactive World Model with Long-Horizon Memory — Zhifei Chen et al. | 交互世界模型训练时让局部与全局注意力头分工，推理时用有界KV缓存加位姿索引地标库检索，兼顾控制、记忆与实时。　相关：记忆管理、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.23565) |
| [MA.Video.23] | EgoGenesis: Egocentric World-Action Modeling with Online Anchored Projective Memory and Action-3D RoPE — Zexuan Yan et al. | 第一人称操作视频模拟器，用首帧3D锚点加周期刷新的投影记忆保持几何稳定，用相机感知的 3D RoPE 编码末端运动，生成数据扩充机器人训练集。　相关：显式状态记忆、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.28243) |
| [MA.Video.22] | Wonder: Video World Model Done Better — Jiacong Xu et al. | 实时相机可控世界探索模型，以稠密坐标场渲染作相机条件，用稀疏注意力记忆只读少量相关上下文token。　相关：隐式状态记忆、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.26037) |
| [MA.Video.21] | StreamHOI: Interaction-aware Temporal Memory Adaptation for Streaming HOI Video Generation — Zejing Rao et al. | 流式人-物交互视频生成：按各Transformer块的历史偏好设定sink与局部记忆布局并训练，用距离缩放增强远程访问。　相关：记忆管理、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.20174) |
| [MA.Video.20] | AlayaWorld: Interactive Long-Horizon World Modeling -- Full Technical Report —  AlayaWorld Team et al. | 150亿参数交互式长程视频世界模型，上下文组合sink帧、压缩历史、几何对齐空间记忆与近期帧，并用自展开误差训练。　相关：记忆管理、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.18367) |
| [MA.Video.19] | WorldDirector: Building Controllable World Simulators with Persistent Dynamic Memory — Hanlin Wang et al. | 用LLM编排3D物体轨迹与相机运动作为生成控制信号，把运动与渲染解耦，使动态物体长时间离开视野后重入仍保持一致。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.02517) |
| [MA.Video.18] | Mem-World: Memory-Augmented Action-Conditioned World Models for Persistent Robot Manipulation — Zirui Zheng et al. | 操作世界模型中构建以腕部视角为中心的4D面元记忆，按未来动作推出相机位姿渲染打分来检索历史帧；用于策略评估时，与真机表现的相关性比 Ctrl-World 高。　相关：显式状态记忆、视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.18960) |
| [MA.Video.17] | ActWorld: From Explorable to Interactive World Model via Action-Aware Memory — Zhexiao Xiong et al. | 让交互世界模型支持物体交互：按交互重要性路由历史压缩，并用持久记忆库保存事件更新与物体身份token。　相关：记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.17730) |
| [MA.Video.16] | DreamX-World 1.0: A General-Purpose Interactive World Model —  DreamX Team et al. | 通用交互式视频世界模型，按相机几何检索早期视图保持重访一致，用自生成长上下文训练减少自回归漂移，并支持用提示触发事件。　相关：视觉记忆、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.16993) |
| [MA.Video.15] | WEAVER, Better, Faster, Longer: An Effective World Model for Robotic Manipulation — Arnav Kumar Jain et al. | 多视角机器人操作世界模型，用flow matching预测未来潜变量与奖励，兼顾保真、长程一致与效率，用于策略评估、策略改进与测试时规划。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.13672) |
| [MA.Video.14] | E$^3$C: Video Generation with 3D Environmental Memory and Ego-Exo Human Pose Control — Qiao Gu et al. | 第一人称视频生成中，用带外观描述的点云3D记忆渲染到目标视角作条件，并分别控制佩戴者与他人的人体动作。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.26316) |
| [MA.Video.13] | WorldCraft: From Camera Navigation to Object Manipulation in Interactive Video World Models — Bohai Gu et al. | 在可导航视频世界模型中加入物体轨迹控制；物体在视野外被移动后，重入时屏蔽离开前的旧记忆帧以保持新状态。　相关：记忆管理、显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.25077) |
| [MA.Video.12] | DexSIM: Real-time Dexterous Simulation with Unified Causal Video Diffusion — Adam Lee | 实时灵巧手操作模拟：把手部轨迹与视频联合嵌入，再以更新的空间缓存作注意力sink做自回归训练，保持长期一致。　相关：隐式状态记忆、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.24630) |
| [MA.Video.11] | SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer — Haoyi Zhu et al. | 26亿参数分钟级世界模型，混合帧级Gated DeltaNet与softmax注意力建模长上下文，并配双分支相机控制。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.15178) |
| [MA.Video.10] | Matrix-Game 3.0: Real-Time and Streaming Interactive World Model with Long-Horizon Memory — Zile Wang et al. | 720p实时交互世界模型，用相机感知记忆检索与注入保持长程一致，并训练模型对回注的含误差生成帧自我纠正；5B 模型最高 40 FPS。　相关：视觉记忆、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.08995) |
| [MA.Video.9] | INSPATIO-WORLD: A Real-Time 4D World Simulator via Spatiotemporal Autoregressive Modeling —  InSpatio Team et al. | 从单段参考视频恢复可交互4D场景的实时模型，用隐式时空缓存聚合历史观测，用显式空间约束保证几何与相机控制。　相关：隐式状态记忆、显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.07209) |
| [MA.Video.8] | EgoSim: Egocentric World Simulator for Embodied Interaction Generation — Jinkun Hao et al. | 闭环第一人称世界模拟器，把3D场景当作可更新状态，生成空间一致的交互视频，并在多阶段交互中持续更新场景。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.01001) |
| [MA.Video.7] | WorldCam: Interactive Autoregressive 3D Gaming Worlds with Camera Pose as a Unifying Geometric Representation — Jisu Nam et al. | 以相机位姿统一动作控制与长程3D一致：用户输入转为6自由度位姿注入生成，并以全局位姿为索引检索历史观测。　相关：视觉记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.16871) |
| [MA.Video.6] | InSpatio-WorldFM: An Open-Source Real-Time Generative Frame Model —  InSpatio Team et al. | 逐帧独立生成的实时帧模型，用显式3D锚点与隐式空间记忆保持多视角一致，支持消费级GPU上交互探索。　相关：显式状态记忆、隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2603.11911) |
| [MA.Video.5] | TeleWorld: Towards Dynamic Multimodal Synthesis with a 4D World Model — Yabo Chen et al. | 实时4D世界模型，把生成视频持续重建成动态4D表示，再用它引导后续生成，以保持长时空间与动态一致。　相关：显式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2601.00051) |
| [MA.Video.4] | WorldPlay: Towards Long-Term Geometric Consistency for Real-Time Interactive World Modeling — Wenqiang Sun et al. | 实时流式交互世界模型，用重组上下文记忆保留几何上重要的远期帧，并用对齐记忆上下文的Context Forcing蒸馏。　相关：视觉记忆、记忆学习 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.14614) |
| [MA.Video.3] | EgoLCD: Egocentric Video Generation with Long Context Diffusion — Liuzhou Zhang et al. | 把长时第一人称视频生成视为记忆管理，结合长期稀疏KV缓存与LoRA扩展的短期注意力记忆，并加记忆正则损失。　相关：记忆管理、隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.04515) |
| [MA.Video.2] | MagicWorld: Towards Long-Horizon Stability for Interactive Video World Exploration — Guangyuan Li et al. | 自回归交互式视频世界模型，用光流约束缓解动态主体运动漂移，用历史缓存检索与多段蒸馏减少长程误差累积。　相关：视觉记忆、记忆学习 | arXiv 2025 | [论文](https://arxiv.org/abs/2511.18886) |
| [MA.Video.1] | Ctrl-World: A Controllable Generative World Model for Robot Manipulation — Yanjiang Guo et al. | 面向通用操作策略评估与改进的多视角可控世界模型，用位姿条件记忆检索保持长程一致，并用想象成功轨迹微调策略。　相关：视觉记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.10125) |

#### World Action Models｜世界动作模型 `[MA.WA]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MA.WA.17] | Motus2: A Self-Evolving General World Model for Dexterous Manipulation — Hong-Zhe Bi et al. | （基础）灵巧操作的自进化通用世界模型，以同一套权重提供策略、模拟器和评估器三种接口形成决策与学习闭环，并研究了对滑动窗口上下文的全局自回归与混合记忆扩展。 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.30237) |
| [MA.WA.16] | HarnessWAM: Bridging Prediction and Deliberation in World Action Models — Zhao-Peng Gu et al. | 为世界动作模型加上智能体式编排，由VLM任务管理器维护基于证据的场景信念和任务图，结合进度估计与事件触发的审议来验证执行、修订计划，并在失败恢复时保留已获取的场景知识。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2608.09516) |
| [MA.WA.15] | World Action Models are Zero-shot Policies — Seonghyeon Ye et al. | （基础）基于预训练视频扩散骨干的世界动作模型，联合预测未来视频与动作，从异构机器人数据中学习技能并实现实时闭环控制。 | arXiv 2026 | [论文](https://arxiv.org/abs/2602.15922) |
| [MA.WA.14] | Causal World Modeling for Robot Control — Lin Li et al. | （基础）自回归扩散框架，在共享隐空间中同时学习帧预测与策略执行，以闭环展开引入真实观测反馈，并异步并行动作预测与执行。 | arXiv 2026 | [论文](https://arxiv.org/abs/2601.21998) |
| [MA.WA.13] | V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning — Mido Assran et al. | （基础）在大规模互联网视频上自监督预训练联合嵌入预测模型，再用少量机器人视频后训练成动作条件隐空间世界模型，以图像目标规划完成抓放。 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.09985) |
| [MA.WA.12] | AWAM: Active Trajectory-Conditioned View Imagination for Robust Robot Manipulation — Jiawei Geng et al. | （基础）主动世界动作模型：预测虚拟相机轨迹并想象沿途视图，压缩成固定记忆后与实时观测融合，以应对遮挡下的操作。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.23396) |
| [MA.WA.11] | LAW: Unifying Language, Action, and World Modeling for Agentic Physical Intelligence — Jiajun Cao et al. | VLM与WAM闭环：VLM规划子任务、评估融合候选动作并判断进度，双路分层视觉记忆按子任务边界保留关键帧。　相关：隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.23334) |
| [MA.WA.10] | RM-WAM: Reliable Memory-Augmented World Action Models for Long-Horizon Robot Manipulation — Cui Miao et al. | WAM结合短期视觉记忆与潜在事件记忆，用反事实替换历史来训练效用门控，按可靠性控制记忆注入。　相关：记忆学习、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.15305) |
| [MA.WA.9] | Long-WAM: Scaling the Context of World-Action Models — Wei Huang et al. | 扩展WAM的因果历史上下文，发现视频底座经自回归预训练时，长历史的收益远大于双向预训练；并以流式编码与异步执行满足实时控制。　相关：隐式状态记忆、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.10528) |
| [MA.WA.8] | RoboJEPA: Scaling Robotic Latent World Models — Artem Zholus et al. | （基础）在12种机器人本体数据上训练JEPA潜空间世界模型，发现想象误差随算力服从二阶幂律，并可零样本按目标图规划。 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.10515) |
| [MA.WA.7] | Memory as Plans: World-Action Modeling with Memory-Grounded Planning — Sizhe Zhao et al. | 把记忆交给规划器：用已完成子段的指令与稀疏帧记录生成下一段语言与视觉计划，执行器只看固定长度上下文并预测动作与进度，RMBench 成功率 83.3%。　相关：视觉记忆、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.11561) |
| [MA.WA.6] | OpenWAM: An Open, Modular Exploration Towards Systematic World-Action Model Pretraining — Yuran Wang et al. | （基础）把WAM设计拆成可替换模块做受控实验，总结骨干、信息流与预训练数据的原则，并开源据此在约 6400 小时人类第一人称与机器人数据上预训练的 OpenWAM-α。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.07398) |
| [MA.WA.5] | WorldScape Policy 2.0: Empowering Steerable World Action Modeling with Reasoning-Augmented Memory and In-Context Learning — Haisheng Su et al. | 可控WAM：把历史VLM输出组织成全局、当前活动与事件边界记忆供进度感知检索，生成隐式子目标，并构建近 500 万事件片段的预训练数据集 ManipEvent-5M。　相关：隐式状态记忆、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2607.18840) |
| [MA.WA.4] | DIM-WAM: World-Action Modeling with Diverse Historical Event Memory — Kai Wang et al. | 用多个并行事件记忆库从真实观测提取历史事件、按相似度合并冗余，并加进度监督，为WAM提供长程任务状态。　相关：记忆管理、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.27677) |
| [MA.WA.3] | MemoryVAM: Integrating Memory into Video Action Model for Robot Manipulation — Yuxin Jiang et al. | 为视频动作模型加情景记忆：Perceiver把逐帧CLIP特征压成记忆token，门控估计任务进度，注入视频与动作分支。　相关：隐式状态记忆、记忆学习 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.20679) |
| [MA.WA.2] | MemoryWAM: Efficient World Action Modeling with Persistent Memory — Sizhe Yang et al. | WAM混合记忆：近期帧、任务起始锚帧加每帧gist token压缩长程历史，以较低时延与显存支持记忆依赖操作。　相关：隐式状态记忆、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.20562) |
| [MA.WA.1] | HiMem-WAM: Hierarchical Memory-Gated World Action Models for Robotic Manipulation — Xiaoquan Sun et al. | 分层潜动作WAM，联合学习运动与技能潜变量，并在预测的技能切换处由边界感知门控写入紧凑任务状态记忆。　相关：隐式状态记忆、记忆管理 | arXiv 2026 | [论文](https://arxiv.org/abs/2606.10363) |

#### Navigation World Models｜导航世界模型 `[MA.Nav]`

| 标签 | 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---|---:|---|
| [MA.Nav.19] | SearchWorld: Spatial Value-Grounded Imagination for UAV Object Search via World Models — Ya-Tai Ji et al. | 面向无人机目标搜索的循环状态空间世界模型，维护BEV探索与障碍记忆并解码任务相关的空间价值层，在想象展开中以该价值先验改进策略。　相关：显式状态记忆、隐式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.09335) |
| [MA.Nav.18] | Remember to be Curious: Episodic Context and Persistent Worlds for 3D Exploration — Lily Goli et al. | 指出好奇心驱动的智能体陷入回环源于缺乏空间持久性和情景上下文，用持续更新的在线3D重建作为持久世界模型计算好奇心奖励，并以基于RGB序列模型的策略保留轨迹历史。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.22814) |
| [MA.Nav.17] | G$^2$WAM: World Action Models for Efficient and Geometry Grounded Image-Goal Navigation — Ke Gui et al. | 图像目标导航中用场景坐标定位把当前、目标与历史帧锚到同一坐标系，在潜空间联合预测未来状态与动作，免去CEM规划。　相关：世界动作模型、显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2610.16558) |
| [MA.Nav.16] | World SLAM Model: Joint World Modeling for SLAM and Navigation — Minghui Qin et al. | 把SLAM的增量状态更新与后端修正引入导航世界模型，预测未来画面时同时估计位姿与稠密几何，维护持久空间状态。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.32626) |
| [MA.Nav.15] | GLAM: Training a latent world model over global spatiotemporal memory for active exploration and navigation — I-Tak Ieong et al. | 在全局时空地图记忆上训练JEPA式潜空间世界模型，联合预测未来地图特征与路径点，用于目标导航与主动探索。　相关：显式状态记忆、世界动作模型 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.14561) |
| [MA.Nav.14] | Visual Representation and History Modeling for Navigation World Models — Guangfu Guo et al. | 研究导航世界模型的表征与历史建模，提出可复用历史的Cached-Linear注意力及带帧级循环记忆的GDN。　相关：隐式状态记忆、记忆评测 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.29555) |
| [MA.Nav.13] | 3D-Belief: Embodied Belief Inference via Generative 3D World Modeling — Yifan Yin et al. | 把世界建模视为3D信念推断，从部分观测推出显式3D场景信念并在线更新，可采样多种补全，用于目标导航。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.11367) |
| [MA.Nav.12] | WorldMAP: Bootstrapping Vision-Language Navigation Trajectory Prediction with Generative World Models — Hongjin Chen et al. | （基础）把世界模型生成的未来视频转成语义-空间记忆和规划伪标签，蒸馏给轻量学生模型直接预测导航轨迹。　相关：显式状态记忆 | arXiv 2026 | [论文](https://arxiv.org/abs/2604.07957) |
| [MA.Nav.11] | Schrödinger's Navigator: Imagining an Ensemble of Futures for Zero-Shot Object Navigation — Yu He et al. | （基础）零样本目标导航中，用轨迹条件3D世界模型想象多种可能的未来场景，汇总成未来感知价值地图来选更稳健的路径点。 | arXiv 2025 | [论文](https://arxiv.org/abs/2512.21201) |
| [MA.Nav.10] | Towards Unified World Models for Visual Navigation via Memory-Augmented Planning and Foresight — Yifei Dong et al. | 在单一多模态自回归骨干中统一视觉预见与导航规划，用分层记忆融合短期感知与长期轨迹上下文。　相关：隐式状态记忆、世界动作模型 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.08713) |
| [MA.Nav.9] | Dream to Recall: Imagination-Guided Experience Retrieval for Memory-Persistent Vision-and-Language Navigation — Yunzhe Xu et al. | 记忆持续型VLN中，用世界模型想象的未来状态作查询，从按视点锚定的观测与行为记忆中检索经验，IR2R上SPL提升5.4。　相关：视觉记忆、显式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2510.08553) |
| [MA.Nav.8] | NavMorph: A Self-Evolving World Model for Vision-and-Language Navigation in Continuous Environments — Xuan Yao et al. | VLN-CE中用RSSM潜空间世界模型前瞻想象，并以跨回合持续更新的上下文演化记忆检索场景信息，实现在线自适应。　相关：隐式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2506.23468) |
| [MA.Nav.7] | Building spatial world models from sparse transitional episodic memories — Zizhan He et al. | 受认知地图启发，从稀疏、不连续的情景转移记忆构建空间世界模型，预测未观测转移，免训练支持探索与导航。　相关：隐式状态记忆、视觉记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2505.13696) |
| [MA.Nav.6] | Learning 3D Persistent Embodied World Models — Siyuan Zhou et al. | 针对视频世界模型缺乏视野外记忆，把生成的RGB-D聚合成持久3D地图，并以此为条件生成后续画面以支撑长程规划。　相关：显式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2505.05495) |
| [MA.Nav.5] | WMNav: Integrating Vision-Language Models into World Models for Object Goal Navigation — Dujun Nie et al. | 用VLM构建零样本目标导航世界模型，预测决策结果并在线维护好奇心价值地图作为记忆，配合两阶段动作提议。　相关：显式状态记忆 | arXiv 2025 | [论文](https://arxiv.org/abs/2503.02247) |
| [MA.Nav.4] | Navigation World Models — Amir Bar et al. | （基础）用10亿参数条件扩散Transformer按过去帧和导航动作预测未来画面，通过模拟轨迹规划或给外部策略的轨迹排序。 | arXiv 2024 | [论文](https://arxiv.org/abs/2412.03572) |
| [MA.Nav.3] | Lookahead Exploration with Neural Radiance Representation for Continuous Vision-Language Navigation — Zihan Wang et al. | （基础）针对VLN-CE前瞻时预测RGB失真且昂贵，用预训练分层神经辐射表示预测候选位置的语义特征，再建路径树选路。 | arXiv 2024 | [论文](https://arxiv.org/abs/2404.01943) |
| [MA.Nav.2] | DREAMWALKER: Mental Planning for Continuous Vision-Language Navigation — Hanqing Wang et al. | （基础）面向连续环境VLN，把视觉、拓扑与动态压缩成离散结构化世界模型，先在其中模拟评估计划再执行。　相关：显式状态记忆 | arXiv 2023 | [论文](https://arxiv.org/abs/2308.07498) |
| [MA.Nav.1] | Pathdreamer: A World Model for Indoor Navigation — Jing Yu Koh et al. | （基础）为室内导航构建视觉世界模型，从已有观测生成未访问视点的360°RGB、语义与深度，用于VLN前瞻规划。 | arXiv 2021 | [论文](https://arxiv.org/abs/2105.08756) |

## 综述

| 论文 | TL;DR（一句话） | 发表 | 资源 |
|---|---|---:|---|
| World-Action Models for Robot Learning and Control: A Survey — Zuxing Lu et al. | 从机器人角度综述世界动作模型，按表示、转移建模、动作接口、架构和训练分类，覆盖操作、导航、驾驶、评测与开放问题。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.16074) |
| The Past Frames the Future: Memory for Autoregressive Video Generation — Harold Haodong Chen et al. | 把自回归视频生成中的记忆定义为跨步保留并影响后续生成的历史信息，从形式、功能、操作、学习、评测五个角度系统梳理。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.28466) |
| Do World Models Make Better Robots? A Survey of Evaluation Benchmarks for Predictive Embodied Intelligence — Gaytri Jena et al. | 梳理 160 个具身评测基准并按评测方式、能力和模型族分四类，指出很少有基准直接对比世界模型与 VLA 策略，并提出评测方案。 | arXiv 2026 | [论文](https://arxiv.org/abs/2609.29669) |
| World Action Models: The Next Frontier in Embodied AI — Siyin Wang et al. | 把联合预测未来状态与动作的模型定义为世界动作模型，按级联/联合架构分类，并梳理数据来源与评测协议。 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.12090) |
| World Model for Robot Learning: A Comprehensive Survey — Bohan Hou et al. | 从机器人学习视角综述世界模型：与策略的耦合、作为强化学习与评测的模拟器、机器人视频世界模型的演进，并延伸到导航和驾驶。 | arXiv 2026 | [论文](https://arxiv.org/abs/2605.00080) |
