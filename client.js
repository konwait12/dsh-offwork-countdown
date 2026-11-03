window.__ModuleLoader__.load({
	id: 'dsh-offwork-countdown',
	factory(require) {
		const React = require('react');
		const h = React.createElement;

		/** Locale namespace and the only client-side storage key this decoration owns. */
		const NS = 'offwork-countdown';
		const STORAGE_KEY = 'dsh.offwork-countdown.v1';
		const POSITION_KEY = 'dsh.offwork-countdown.position.v1';
		const DEFAULTS = { start: '09:00', end: '18:00', weekdaysOnly: true };

		/** Simplified Chinese dictionary (key-set source of truth). */
		const ZH = {
			'card.label': '下班倒计时',
			'title.working': '距离下班',
			'title.done': '已下班',
			'title.rest': '休息日',
			'value.rest': '—',
			'meta.working': '{start} – {end} · {weekday}',
			'meta.before': '{start} 上班 · {weekday}',
			'meta.done': '{end} 下班 · 今天辛苦了',
			'meta.rest': '下个工作日 {weekday} {start}',
			'progress.label': '今日进度 {percent}%',
			'settings.open': '配置上下班时间',
			'settings.title': '上下班时间',
			'settings.start': '上班',
			'settings.end': '下班',
			'settings.weekdaysOnly': '仅工作日',
			'settings.save': '保存',
			'settings.cancel': '取消',
			'settings.reset': '恢复默认',
			'settings.hint': '保存在本机 · 按住卡片可拖动',
			'error.endAfterStart': '下班时间需晚于上班时间',
			'error.format': '请输入有效时间',
			'weekday.0': '周日',
			'weekday.1': '周一',
			'weekday.2': '周二',
			'weekday.3': '周三',
			'weekday.4': '周四',
			'weekday.5': '周五',
			'weekday.6': '周六'
		};

		/** English dictionary, checked complete against the ZH key set. */
		const EN = {
			'card.label': 'Off-work countdown',
			'title.working': 'Until off work',
			'title.done': 'Off work',
			'title.rest': 'Day off',
			'value.rest': '—',
			'meta.working': '{start} – {end} · {weekday}',
			'meta.before': 'Starts {start} · {weekday}',
			'meta.done': 'Off at {end} · nice work today',
			'meta.rest': 'Next workday {weekday} {start}',
			'progress.label': 'Today {percent}%',
			'settings.open': 'Configure work hours',
			'settings.title': 'Work hours',
			'settings.start': 'Start',
			'settings.end': 'End',
			'settings.weekdaysOnly': 'Weekdays only',
			'settings.save': 'Save',
			'settings.cancel': 'Cancel',
			'settings.reset': 'Reset',
			'settings.hint': 'Saved on this device · drag to move',
			'error.endAfterStart': 'End time must be after start time',
			'error.format': 'Enter a valid time',
			'weekday.0': 'Sun',
			'weekday.1': 'Mon',
			'weekday.2': 'Tue',
			'weekday.3': 'Wed',
			'weekday.4': 'Thu',
			'weekday.5': 'Fri',
			'weekday.6': 'Sat'
		};

		/** Card-local stylesheet, rendered as an element so unmounting removes it. */
		const CSS =
			'.ofw-root{position:absolute;top:calc(var(--dsh-frame-overlay-top,56px) + 56px);right:16px;display:flex;' +
			'justify-content:flex-end;max-width:calc(100vw - 32px);pointer-events:none}' +
			'.ofw-card{box-sizing:border-box;display:flex;flex-direction:column;gap:6px;width:292px;max-width:100%;' +
			'padding:8px 12px 9px;border:.5px solid var(--dsw-alias-border-l1);border-radius:12px;' +
			'background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-elevation-panel);pointer-events:auto;' +
			'user-select:none;color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px}' +
			'.ofw-card[data-dragging="true"]{box-shadow:var(--dsw-elevation-prominent)}' +
			'.ofw-body{display:flex;flex-direction:column;gap:6px;min-width:0;cursor:grab;touch-action:none}' +
			'.ofw-card[data-dragging="true"] .ofw-body{cursor:grabbing}' +
			'.ofw-row{display:flex;align-items:center;gap:6px;min-width:0}' +
			'.ofw-lead{flex:none;display:grid;place-items:center;width:16px;height:16px;color:var(--dsw-alias-brand-primary)}' +
			'.ofw-label{flex:none;white-space:nowrap;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}' +
			'.ofw-time{flex:none;margin-left:auto;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;' +
			'font-size:17px;line-height:20px;font-weight:600;letter-spacing:.2px;font-variant-numeric:tabular-nums;' +
			'color:var(--dsw-alias-label-primary)}' +
			'.ofw-card[data-kind="done"] .ofw-time{color:var(--dsw-alias-state-success-primary)}' +
			'.ofw-card[data-kind="rest"] .ofw-time{font-size:15px;color:var(--dsw-alias-label-secondary)}' +
			'.ofw-gear{flex:none;display:grid;place-items:center;width:24px;height:24px;margin:-2px -6px -2px 0;padding:0;' +
			'border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit}' +
			'.ofw-gear:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}' +
			'.ofw-gear:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}' +
			'.ofw-track{display:block;height:4px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}' +
			'.ofw-fill{display:block;height:100%;border-radius:999px;background:var(--dsw-alias-brand-primary);transition:width .4s ease}' +
			'.ofw-card[data-kind="done"] .ofw-fill{background:var(--dsw-alias-state-success-primary)}' +
			'.ofw-meta{display:flex;align-items:baseline;gap:8px;min-width:0;font-size:11px;line-height:15px;' +
			'color:var(--dsw-alias-label-secondary)}' +
			'.ofw-metaText{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
			'.ofw-percent{flex:none;font-variant-numeric:tabular-nums}' +
			'.ofw-form{display:flex;flex-direction:column;gap:8px;min-width:0}' +
			'.ofw-formHead{display:flex;align-items:baseline;gap:8px;min-width:0}' +
			'.ofw-formTitle{flex:none;font-size:12px;line-height:18px;font-weight:500;color:var(--dsw-alias-label-primary)}' +
			'.ofw-formHint{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
			'text-align:right;font-size:11px;line-height:15px;color:var(--dsw-alias-label-secondary)}' +
			'.ofw-fields{display:flex;gap:8px}' +
			'.ofw-field{display:flex;flex:1 1 0;flex-direction:column;gap:3px;min-width:0;font-size:11px;line-height:15px;' +
			'color:var(--dsw-alias-label-secondary)}' +
			'.ofw-field input{box-sizing:border-box;width:100%;height:26px;padding:0 6px;border:.5px solid var(--dsw-alias-border-l1);' +
			'border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}' +
			'.ofw-field input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}' +
			'.ofw-check{display:flex;align-items:center;gap:6px;font-size:11px;line-height:15px;' +
			'color:var(--dsw-alias-label-secondary);cursor:pointer}' +
			'.ofw-check input{width:13px;height:13px;margin:0;accent-color:var(--dsw-alias-brand-primary)}' +
			'.ofw-error{font-size:11px;line-height:15px;color:var(--dsw-alias-state-error-primary)}' +
			'.ofw-actions{display:flex;align-items:center;gap:6px;justify-content:flex-end}' +
			'.ofw-btn{height:24px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l1);border-radius:6px;' +
			'background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}' +
			'.ofw-btn:hover{background:var(--dsw-alias-bg-layer-2)}' +
			'.ofw-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}' +
			'.ofw-btnGhost{margin-right:auto;border-color:transparent;color:var(--dsw-alias-label-secondary)}' +
			'.ofw-btnPrimary{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}' +
			'@media (prefers-reduced-motion:reduce){.ofw-fill{transition:none}}';

		const toPad = (value) => String(value).padStart(2, '0');

		/** Parse an `HH:MM` (or `H:MM`) value into minutes since midnight, or null. */
		function toMinutes(value) {
			if (typeof value !== 'string') return null;
			const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
			if (match === null) return null;
			const hours = Number(match[1]);
			const minutes = Number(match[2]);
			if (hours > 23 || minutes > 59) return null;
			return hours * 60 + minutes;
		}

		/** Format minutes since midnight as `HH:MM`. */
		function toTime(minutes) {
			return toPad(Math.floor(minutes / 60)) + ':' + toPad(minutes % 60);
		}

		/** Format a non-negative second count as `HH:MM:SS`. */
		function formatDuration(seconds) {
			const total = Math.max(0, Math.floor(seconds));
			return toPad(Math.floor(total / 3600)) + ':' + toPad(Math.floor((total % 3600) / 60)) + ':' + toPad(total % 60);
		}

		/** Coerce persisted JSON into a valid settings object, or fall back to defaults. */
		function normalizeSettings(raw) {
			const start = toMinutes(raw && raw.start);
			const end = toMinutes(raw && raw.end);
			if (start === null || end === null || end <= start) return { ...DEFAULTS };
			return {
				start: toTime(start),
				end: toTime(end),
				weekdaysOnly: raw && typeof raw.weekdaysOnly === 'boolean' ? raw.weekdaysOnly : DEFAULTS.weekdaysOnly
			};
		}

		function loadSettings() {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (raw === null) return { ...DEFAULTS };
				return normalizeSettings(JSON.parse(raw));
			} catch (error) {
				return { ...DEFAULTS };
			}
		}

		function saveSettings(settings) {
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
			} catch (error) {
				// A blocked or full storage keeps the session-local value; the card still works.
			}
		}

		/** Keep a dragged card fully inside the viewport. */
		function clampPosition(position, width, height) {
			const maxX = Math.max(0, window.innerWidth - width);
			const maxY = Math.max(0, window.innerHeight - height);
			return {
				x: Math.min(Math.max(0, Math.round(position.x)), maxX),
				y: Math.min(Math.max(0, Math.round(position.y)), maxY)
			};
		}

		/** Read a dragged position (`null` means "use the default top-right anchor"). */
		function loadPosition() {
			try {
				const raw = window.localStorage.getItem(POSITION_KEY);
				if (raw === null) return null;
				const parsed = JSON.parse(raw);
				if (parsed === null || typeof parsed !== 'object') return null;
				if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null;
				return { x: parsed.x, y: parsed.y };
			} catch (error) {
				return null;
			}
		}

		function savePosition(position) {
			try {
				window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
			} catch (error) {
				// A blocked storage only loses the remembered spot; dragging still works this session.
			}
		}

		/** Next working weekday after `now`, used by the rest-state subtitle. */
		function nextWorkday(now, settings) {
			const probe = new Date(now.getTime());
			for (let step = 0; step < 7; step += 1) {
				probe.setDate(probe.getDate() + 1);
				const day = probe.getDay();
				if (!settings.weekdaysOnly || (day >= 1 && day <= 5)) return day;
			}
			return 1;
		}

		/** Derive the card state from the current instant and the configured work hours. */
		function computeState(nowMs, settings) {
			const now = new Date(nowMs);
			const startMin = toMinutes(settings.start) ?? 9 * 60;
			const endMin = toMinutes(settings.end) ?? 18 * 60;
			const start = endMin > startMin ? startMin : 9 * 60;
			const end = endMin > start ? endMin : 18 * 60;
			const day = now.getDay();
			const workday = !settings.weekdaysOnly || (day >= 1 && day <= 5);
			if (!workday) {
				return { kind: 'rest', day, start: toTime(start), end: toTime(end), seconds: 0, progress: 0, next: nextWorkday(now, settings) };
			}
			const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
			const startSeconds = start * 60;
			const endSeconds = end * 60;
			if (nowSeconds < startSeconds) {
				return { kind: 'before', day, start: toTime(start), end: toTime(end), seconds: endSeconds - nowSeconds, progress: 0 };
			}
			if (nowSeconds < endSeconds) {
				return {
					kind: 'working',
					day,
					start: toTime(start),
					end: toTime(end),
					seconds: endSeconds - nowSeconds,
					progress: (nowSeconds - startSeconds) / (endSeconds - startSeconds)
				};
			}
			return { kind: 'done', day, start: toTime(start), end: toTime(end), seconds: nowSeconds - endSeconds, progress: 1 };
		}

		/** Interpolate `{name}` placeholders, used only when the locale seat is absent. */
		function fallbackTranslate(key, params) {
			let text = ZH[key] ?? key;
			if (params !== undefined) {
				for (const name of Object.keys(params)) text = text.split('{' + name + '}').join(String(params[name]));
			}
			return text;
		}

		function leadIcon() {
			return h(
				'svg',
				{ viewBox: '0 0 16 16', width: 16, height: 16, fill: 'none', 'aria-hidden': true },
				h('circle', { cx: 8, cy: 8, r: 6.1, stroke: 'currentColor', strokeWidth: 1.4 }),
				h('path', { d: 'M8 4.6V8l2.4 1.5', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' })
			);
		}

		function settingsIcon() {
			return h(
				'svg',
				{ viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
				h('path', { d: 'M2.5 5.5h11M2.5 10.5h11', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
				h('path', { d: 'M6 3.5v4M10.5 8.5v4', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' })
			);
		}

		/** One small floating card in the top-right corner: countdown, progress, and inline settings. */
		function CountdownCard(props) {
			const t = typeof props.t === 'function' ? props.t : fallbackTranslate;
			const [settings, setSettings] = React.useState(loadSettings);
			const [nowMs, setNowMs] = React.useState(() => Date.now());
			const [mode, setMode] = React.useState('card');
			const [draft, setDraft] = React.useState(settings);
			const [error, setError] = React.useState('');
			const [position, setPosition] = React.useState(loadPosition);
			const [dragging, setDragging] = React.useState(false);
			const cardRef = React.useRef(null);
			const positionRef = React.useRef(position);
			const dragRef = React.useRef(null);

			React.useEffect(() => {
				const tick = () => setNowMs(Date.now());
				const timer = window.setInterval(tick, 1000);
				const onVisibility = () => {
					if (!document.hidden) tick();
				};
				document.addEventListener('visibilitychange', onVisibility);
				return () => {
					window.clearInterval(timer);
					document.removeEventListener('visibilitychange', onVisibility);
				};
			}, []);

			React.useEffect(() => {
				positionRef.current = position;
			}, [position]);

			// Keep a dragged card inside the viewport after the window shrinks.
			React.useEffect(() => {
				const keepOnScreen = () => {
					const saved = positionRef.current;
					const card = cardRef.current;
					if (saved === null || card === null) return;
					const rect = card.getBoundingClientRect();
					const next = clampPosition(saved, rect.width, rect.height);
					if (next.x === saved.x && next.y === saved.y) return;
					positionRef.current = next;
					setPosition(next);
				};
				keepOnScreen();
				window.addEventListener('resize', keepOnScreen);
				return () => window.removeEventListener('resize', keepOnScreen);
			}, []);

			// Track the pointer while dragging; persist the final spot on release.
			React.useEffect(() => {
				if (!dragging) return undefined;
				const onMove = (event) => {
					const drag = dragRef.current;
					const card = cardRef.current;
					if (drag === null || card === null) return;
					const rect = card.getBoundingClientRect();
					const next = clampPosition(
						{ x: event.clientX - drag.dx, y: event.clientY - drag.dy },
						rect.width,
						rect.height
					);
					positionRef.current = next;
					setPosition(next);
				};
				const finish = () => {
					setDragging(false);
					if (positionRef.current !== null) savePosition(positionRef.current);
				};
				window.addEventListener('pointermove', onMove);
				window.addEventListener('pointerup', finish);
				window.addEventListener('pointercancel', finish);
				return () => {
					window.removeEventListener('pointermove', onMove);
					window.removeEventListener('pointerup', finish);
					window.removeEventListener('pointercancel', finish);
				};
			}, [dragging]);

			const state = computeState(nowMs, settings);
			const percent = Math.max(0, Math.min(100, Math.round(state.progress * 100)));
			let title = t('title.working');
			let value = formatDuration(state.seconds);
			let meta = '';
			let percentText = percent + '%';
			if (state.kind === 'rest') {
				title = t('title.rest');
				value = t('value.rest');
				meta = t('meta.rest', { weekday: t('weekday.' + state.next), start: state.start });
				percentText = '';
			} else if (state.kind === 'done') {
				title = t('title.done');
				meta = t('meta.done', { end: state.end });
				percentText = '100%';
			} else if (state.kind === 'before') {
				meta = t('meta.before', { start: state.start, weekday: t('weekday.' + state.day) });
			} else {
				meta = t('meta.working', { start: state.start, end: state.end, weekday: t('weekday.' + state.day) });
			}

			const openSettings = () => {
				setDraft(settings);
				setError('');
				setMode('settings');
			};
			const closeSettings = () => {
				setError('');
				setMode('card');
			};
			const resetDraft = () => {
				setDraft({ ...DEFAULTS });
				setError('');
			};
			const commit = () => {
				const startMin = toMinutes(draft.start);
				const endMin = toMinutes(draft.end);
				if (startMin === null || endMin === null) {
					setError(t('error.format'));
					return;
				}
				if (endMin <= startMin) {
					setError(t('error.endAfterStart'));
					return;
				}
				const next = {
					start: toTime(startMin),
					end: toTime(endMin),
					weekdaysOnly: draft.weekdaysOnly !== false
				};
				saveSettings(next);
				setSettings(next);
				setError('');
				setMode('card');
			};

			const startDrag = (event) => {
				if (mode !== 'card' || event.button !== 0) return;
				const target = event.target;
				if (target !== null && typeof target.closest === 'function' && target.closest('button') !== null) return;
				const card = cardRef.current;
				if (card === null) return;
				const rect = card.getBoundingClientRect();
				dragRef.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
				event.preventDefault();
				const handle = event.currentTarget;
				if (typeof handle.setPointerCapture === 'function') {
					try {
						handle.setPointerCapture(event.pointerId);
					} catch (error) {
						// Capture is an enhancement; the window listeners still track the drag.
					}
				}
				setDragging(true);
			};

			const field = (key, label) =>
				h(
					'label',
					{ className: 'ofw-field' },
					h('span', null, label),
					h('input', {
						type: 'time',
						value: draft[key],
						required: true,
						onChange: (event) => setDraft({ ...draft, [key]: event.target.value })
					})
				);

			const settingsView = h(
				'form',
				{
					className: 'ofw-form',
					onSubmit: (event) => {
						event.preventDefault();
						commit();
					}
				},
				h(
					'div',
					{ className: 'ofw-formHead' },
					h('span', { className: 'ofw-formTitle' }, t('settings.title')),
					h('span', { className: 'ofw-formHint' }, t('settings.hint'))
				),
				h('div', { className: 'ofw-fields' }, field('start', t('settings.start')), field('end', t('settings.end'))),
				h(
					'label',
					{ className: 'ofw-check' },
					h('input', {
						type: 'checkbox',
						checked: draft.weekdaysOnly !== false,
						onChange: (event) => setDraft({ ...draft, weekdaysOnly: event.target.checked })
					}),
					h('span', null, t('settings.weekdaysOnly'))
				),
				error === '' ? null : h('div', { className: 'ofw-error', role: 'alert' }, error),
				h(
					'div',
					{ className: 'ofw-actions' },
					h('button', { type: 'button', className: 'ofw-btn ofw-btnGhost', onClick: resetDraft }, t('settings.reset')),
					h('button', { type: 'button', className: 'ofw-btn', onClick: closeSettings }, t('settings.cancel')),
					h('button', { type: 'submit', className: 'ofw-btn ofw-btnPrimary' }, t('settings.save'))
				)
			);

			const cardView = h(
				'div',
				{ className: 'ofw-body', onPointerDown: startDrag },
				h(
					'div',
					{ className: 'ofw-row' },
					h('span', { className: 'ofw-lead', 'aria-hidden': true }, leadIcon()),
					h('span', { className: 'ofw-label' }, title),
					h('span', { className: 'ofw-time' }, value),
					h(
						'button',
						{
							type: 'button',
							className: 'ofw-gear',
							title: t('settings.open'),
							'aria-label': t('settings.open'),
							onClick: openSettings
						},
						settingsIcon()
					)
				),
				h(
					'div',
					{
						className: 'ofw-track',
						role: 'progressbar',
						'aria-label': t('progress.label', { percent }),
						'aria-valuemin': 0,
						'aria-valuemax': 100,
						'aria-valuenow': percent
					},
					h('div', { className: 'ofw-fill', style: { width: percent + '%' } })
				),
				h(
					'div',
					{ className: 'ofw-meta' },
					h('span', { className: 'ofw-metaText' }, meta),
					percentText === '' ? null : h('span', { className: 'ofw-percent' }, percentText)
				)
			);

			const rootStyle =
				position === null ? undefined : { left: position.x + 'px', top: position.y + 'px', right: 'auto' };

			return h(
				'div',
				{ className: 'ofw-root', style: rootStyle },
				h('style', null, CSS),
				h(
					'section',
					{
						ref: cardRef,
						className: 'ofw-card',
						'data-kind': state.kind,
						'data-dragging': dragging ? 'true' : 'false',
						'aria-label': t('card.label')
					},
					mode === 'settings' ? settingsView : cardView
				)
			);
		}

		return {
			inject: ['slots', 'locale'],
			apply(ctx) {
				ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'offwork-countdown: dictionaries');
				ctx.slots.inject('shell.overlay', () =>
					ctx.slots.register(
						{
							name: 'shell.overlay',
							id: 'offwork-countdown',
							order: 0,
							locale: NS
						},
						CountdownCard
					)
				);
			}
		};
	}
});
