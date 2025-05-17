import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App 컴포넌트', () => {
  it('타이틀 렌더 테스트 ', () => {
    render(<App />);
    expect(screen.getByText('테일윈드 CSS 테스트')).toBeInTheDocument();
  });

  it('카운트 버튼 테스트', () => {
    render(<App />);
    const button = screen.getByText('카운트: 0');
    expect(button).toBeInTheDocument();
  });
}); 