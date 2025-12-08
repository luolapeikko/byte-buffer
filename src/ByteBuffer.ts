/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
const enum SizeMap {
	BYTE = 1,
	SHORT = 2,
	INT = 4,
	LONG = 8,
	FLOAT = 4,
	DOUBLE = 8,
}

/**
 * Java style ByteBuffer implementation in TypeScript
 */
export class ByteBuffer {
	private _buffer: Buffer;
	private _position: number = 0;

	constructor(size: number) {
		this._buffer = Buffer.alloc(size);
	}

	public get(index?: number): number {
		if (index) {
			return this._buffer[index];
		} else {
			return this._buffer[this._position++];
		}
	}

	public getChar(index?: number): string {
		return String.fromCharCode(this.get(index));
	}

	public getShort(index?: number): number {
		const pos = this.getPos(index);
		const {byteSize} = this.assertCapacity(SizeMap.SHORT, pos);
		return this._buffer.subarray(pos, pos + byteSize).readInt16BE();
	}

	public set(value: number, index?: number): void {
		const {position} = this.assertCapacity(SizeMap.BYTE, this.getPos(index));
		this._buffer[position] = value;
	}

	public putChar(value: string, index?: number): void {
		this.set(value.charCodeAt(0), this.getPos(index));
	}

	public rewind(): void {
		this._position = 0;
	}

	/**
	 * get remaining byte count
	 */
	public remaining(): number {
		return this._buffer.length - this._position;
	}

	/**
	 * check if there are remaining bytes
	 * @returns
	 */
	public hasRemaining(): boolean {
		return this.remaining() > 0;
	}

	public capacity(): number {
		return this._buffer.length;
	}

	public clear(): void {
		this._position = 0;
		this._buffer.fill(0);
	}

	public position(position?: number): number {
		if (position) {
			this._position = this.assertPosition(position);
		}
		return this._position;
	}

	private assertPosition(value: number): number {
		if (value < 0 || value >= this._buffer.length) {
			throw new Error('Index out of bounds');
		}
		return value;
	}

	private assertCapacity(byteSize: number, position: number): {byteSize: number; position: number} {
		if (position + byteSize > this._buffer.length) {
			throw new Error('Buffer overflow');
		}
		return {byteSize, position};
	}

	private getPos(index?: number) {
		return index || this._position;
	}
}
